from conection import conex
import mysql.connector

class Pago:
    def __init__(self, tipoPago, precioInicial, adelanto, restante, totalPago, estadoPago):
        self.tipo_pago = tipoPago
        self.precio_inicial = precioInicial
        self.adelanto = adelanto
        self.restante = restante
        self.total_pago = totalPago
        self.estado_pago = estadoPago

    def insertar(self):
        connection = conex()
        if connection:
            try:
                cursor = connection.cursor()
                query = """INSERT INTO pagos (tipo_pago, precio_inicial, adelanto, restante, total, estado_pago)
                           VALUES (%s, %s, %s, %s, %s, %s)"""
                data = (self.tipo_pago, self.precio_inicial, self.adelanto, self.restante, self.total_pago, self.estado_pago)
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
