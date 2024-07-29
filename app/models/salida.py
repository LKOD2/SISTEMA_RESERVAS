from conection import conex
import mysql.connector

class Salida:
    
    @staticmethod
    def obtener_datos_reserva(id_hab):
        connection = conex()
        if connection:
            try:
                cursor = connection.cursor(dictionary=True)
                query = """SELECT * FROM reservas WHERE habitaciones_id = %s AND estado = 'activa'"""
                cursor.execute(query, (id_hab,))
                result = cursor.fetchone()
                return result
            except mysql.connector.Error as e:
                print(f"Error al obtener datos de la reserva: {e}")
                return None
            finally:
                cursor.close()
                connection.close()

    @staticmethod
    def obtener_datos_habitacion(id_hab):
        connection = conex()
        if connection:
            try:
                cursor = connection.cursor(dictionary=True)
                query = """SELECT * FROM habitaciones WHERE ID = %s"""
                cursor.execute(query, (id_hab,))
                result = cursor.fetchone()
                return result
            except mysql.connector.Error as e:
                print(f"Error al obtener datos de la habitación: {e}")
                return None
            finally:
                cursor.close()
                connection.close()

    @staticmethod
    def obtener_datos_huesped_responsable(reserva_id):
        connection = conex()
        if connection:
            try:
                cursor = connection.cursor(dictionary=True)
                query = """
                SELECT h.* 
                FROM huespedes h
                JOIN hues_res hr ON h.ID = hr.huespedes_id
                WHERE hr.reservas_id = %s AND hr.responsable = 1
                """
                cursor.execute(query, (reserva_id,))
                result = cursor.fetchone()
                print('resultado huesped', result)
                return result
            except mysql.connector.Error as e:
                print(f"Error al obtener datos del huésped responsable: {e}")
                return None
            finally:
                cursor.close()
                connection.close()

    @staticmethod
    def obtener_datos_pagos(pagos_id):
        connection = conex()
        if connection:
            try:
                cursor = connection.cursor(dictionary=True)
                query = """SELECT * FROM pagos WHERE ID = %s"""
                cursor.execute(query, (pagos_id,))
                result = cursor.fetchone()
                return result
            except mysql.connector.Error as e:
                print(f"Error al obtener datos de los pagos: {e}")
                return None
            finally:
                cursor.close()
                connection.close()