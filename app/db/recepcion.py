from conection import conex
import mysql.connector



def insert_reserva(usuario, habitacion, huesped, pago, reserva):
    connection = conex()
    if connection:
        try:
            cursor = connection.cursor()

            # Insertar datos del huésped
            query_huesped = """INSERT INTO huespedes (nombre, apellido, email, telefono, pais, tipo_documento, num_documento, estado)
                               VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"""
            data_huesped = (huesped['nombre'], huesped['apellido'], huesped['email'],
                            huesped['telefono'], huesped['pais'], huesped['tipoDoc'], huesped['numDoc'], 'activo')
            cursor.execute(query_huesped, data_huesped)
            huesped_id = cursor.lastrowid

            # Insertar datos del pago
            query_pago = """INSERT INTO pagos (tipo_pago, adelanto, total, estado_pago)
                            VALUES (%s, %s, %s, %s)"""
            data_pago = (pago['tipoPago'], pago['adelanto'], pago['totalPago'], pago['estadoPago'])
            cursor.execute(query_pago, data_pago)
            pago_id = cursor.lastrowid

            print('pago id', pago_id)

            # Insertar datos de la reserva
            query_reserva = """INSERT INTO reservas (habitaciones_id, pagos_id, usuarios_usuario, fecha_entrada, fecha_salida, observacion, cant_personas, estado)
                               VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"""
            data_reserva = (habitacion['ID'], pago_id, usuario, reserva['fechaEntrada'], reserva['fechaSalida'], reserva['observacion'], 0, 'proceso')
            cursor.execute(query_reserva, data_reserva)
            reserva_id = cursor.lastrowid

            # Relacionar huésped con reserva
            query_hues_res = """INSERT INTO hues_res (huespedes_id, reservas_id)
                                VALUES (%s, %s)"""
            data_hues_res = (huesped_id, reserva_id)
            cursor.execute(query_hues_res, data_hues_res)

            connection.commit()
            return True
        except mysql.connector.Error as e:
            print("Error al insertar datos:", e)
            connection.rollback()
            return False
        finally:
            cursor.close()
            connection.close()
    else:
        return False