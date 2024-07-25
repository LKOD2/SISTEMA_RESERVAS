from conection import conex
import mysql.connector

class Pago:
    def __init__(self, tipoPago, adelanto, totalPago, estadoPago):
        self.tipo_pago = tipoPago
        self.adelanto = adelanto
        self.total_pago = totalPago
        self.estado_pago = estadoPago

    def insertar(self):
        connection = conex()
        if connection:
            try:
                cursor = connection.cursor()
                query = """INSERT INTO pagos (tipo_pago, adelanto, total, estado_pago)
                           VALUES (%s, %s, %s, %s)"""
                data = (self.tipo_pago, self.adelanto, self.total_pago, self.estado_pago)
                cursor.execute(query, data)
                connection.commit()
                self.id = cursor.lastrowid
                return self.id
            except mysql.connector.Error as e:
                print(f"Error al insertar pago: {e}")
                connection.rollback()
                return None
            finally:
                cursor.close()
                connection.close()
