from conection import conex
import mysql.connector

class Habitacion:
    def __init__(self, id, numero, tipo, estado, orientacion, precio):
        self.id = id
        self.numero = numero
        self.tipo = tipo
        self.estado = estado
        self.orientacion = orientacion
        self.precio = precio

    @staticmethod
    def actualizar_estado(id, nuevo_estado):
        connection = conex()
        if connection:
            try:
                cursor = connection.cursor()
                query = "UPDATE habitaciones SET estado = %s WHERE id = %s"
                cursor.execute(query, (nuevo_estado, id))
                connection.commit()
            except mysql.connector.Error as e:
                print(f"Error al actualizar el estado de la habitación: {e}")
                connection.rollback()
            finally:
                cursor.close()
                connection.close()
