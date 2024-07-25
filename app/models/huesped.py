from conection import conex
import mysql.connector


class Huesped:
    def __init__(self,responsable, nombre, apellido, email, telefono, pais, tipoDocumento, numDocumento, estado='activo'):
        self.responsable = responsable
        self.nombre = nombre
        self.apellido = apellido
        self.email = email
        self.telefono = telefono
        self.pais = pais
        self.tipo_documento = tipoDocumento
        self.num_documento = numDocumento
        self.estado = estado

    def insertar(self):
        connection = conex()
        if connection:
            try:
                cursor = connection.cursor()
                query = """INSERT INTO huespedes (nombre, apellido, email, telefono, pais, tipo_documento, num_documento, estado)
                           VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"""
                data = (self.nombre, self.apellido, self.email, self.telefono, self.pais, self.tipo_documento, self.num_documento, self.estado)
                cursor.execute(query, data)
                connection.commit()
                self.id = cursor.lastrowid
                return self.id
            except mysql.connector.Error as e:
                print(f"Error al insertar huésped: {e}")
                connection.rollback()
                return None
            finally:
                cursor.close()
                connection.close()

    @staticmethod
    def obtener_id_existente(tipo_documento, num_documento):
        connection = conex()
        if connection:
            try:
                cursor = connection.cursor()
                query = """SELECT id FROM huespedes WHERE tipo_documento = %s AND num_documento = %s"""
                cursor.execute(query, (tipo_documento, num_documento))
                result = cursor.fetchone()
                if result:
                    return result[0]
                return None
            except mysql.connector.Error as e:
                print(f"Error al verificar existencia del huésped: {e}")
                return None
            finally:
                cursor.close()
                connection.close()
