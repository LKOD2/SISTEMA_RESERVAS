from conection import conex
from .habitacion import Habitacion
import mysql.connector


class Reserva:
    def __init__(self, habitacion_id, pago_id, usuario, fechaEntrada, fechaSalida, observacion, cant_personas=0, estado='activa'):
        self.habitacion_id = habitacion_id
        self.pago_id = pago_id
        self.usuario = usuario
        self.fecha_entrada = fechaEntrada
        self.fecha_salida = fechaSalida
        self.observacion = observacion
        self.cant_personas = cant_personas
        self.estado = estado

    def insertar(self):
        connection = conex()
        if connection:
            try:
                cursor = connection.cursor()
                query = """INSERT INTO reservas (habitaciones_id, pagos_id, usuarios_usuario, fecha_entrada, fecha_salida, observacion, cant_personas, estado)
                           VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"""
                data = (self.habitacion_id, self.pago_id, self.usuario, self.fecha_entrada, self.fecha_salida, self.observacion, self.cant_personas, self.estado)
                cursor.execute(query, data)
                connection.commit()
                self.id = cursor.lastrowid
                return self.id
            except mysql.connector.Error as e:
                print(f"Error al insertar reserva: {e}")
                connection.rollback()
                return None
            finally:
                cursor.close()
                connection.close()

    def relacionar_huesped(self, huesped_id, responsable):
        connection = conex()
        if connection:
            try:
                print('relacionar-huesped', huesped_id, responsable)
                cursor = connection.cursor()
                query = """INSERT INTO hues_res (huespedes_id, reservas_id, responsable)
                           VALUES (%s, %s, %s)"""
                cursor.execute(query, (huesped_id, self.id, responsable))
                connection.commit()
            except mysql.connector.Error as e:
                print(f"Error al relacionar huésped con reserva: {e}")
                connection.rollback()
            finally:
                cursor.close()
                connection.close()
