from conection import conex
import mysql.connector

def finalizar(reserva_id, multa_pago):
    connection = conex()
    if connection:
        try:
            cursor = connection.cursor()

            # Obtener la información de la reserva
            query_reserva = "SELECT habitaciones_id, pagos_id FROM reservas WHERE ID = %s"
            cursor.execute(query_reserva, (reserva_id,))
            reserva_data = cursor.fetchone()
            if not reserva_data:
                return {'estado': False, 'mensaje': 'Reserva no encontrada'}

            habitacion_id, pagos_id = reserva_data

            # Obtener todos los ID de huéspedes asociados a la reserva
            query_huespedes = """
                SELECT huespedes_id 
                FROM hues_res 
                WHERE reservas_id = %s
            """
            cursor.execute(query_huespedes, (reserva_id,))
            huespedes_data = cursor.fetchall()
            if not huespedes_data:
                return {'estado': False, 'mensaje': 'No se encontraron huéspedes asociados a la reserva'}

            # Actualizar estado de todos los huéspedes asociados
            for huesped_data in huespedes_data:
                huesped_id = huesped_data[0]
                query_update_huesped = "UPDATE huespedes SET estado = 'inactivo' WHERE ID = %s"
                cursor.execute(query_update_huesped, (huesped_id,))

            # Actualizar estado de la habitación
            query_update_habitacion = "UPDATE habitaciones SET estado = 'disponible' WHERE ID = %s"
            cursor.execute(query_update_habitacion, (habitacion_id,))

            # Actualizar estado del pago
            query_update_pago = "UPDATE pagos SET estado_pago = 'completado', multa = %s WHERE ID = %s"
            cursor.execute(query_update_pago, (multa_pago, pagos_id))

            # Actualizar estado de la reserva
            query_update_reserva = "UPDATE reservas SET estado = 'finalizada' WHERE ID = %s"
            cursor.execute(query_update_reserva, (reserva_id,))

            connection.commit()
            return {'estado': True, 'mensaje': 'Reserva finalizada con éxito'}

        except mysql.connector.Error as e:
            print(f"Error al finalizar reserva: {e}")
            connection.rollback()
            return {'estado': False, 'mensaje': 'Error al finalizar la reserva'}
        
        finally:
            cursor.close()
            connection.close()
    else:
        return {'estado': False, 'mensaje': 'Error en la conexión a la base de datos'}
