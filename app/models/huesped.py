from conection import conex
import mysql.connector

class Huesped:
    def __init__(self, responsable, nombre, apellido, email, telefono, pais, tipoDocumento, numDocumento, estado='activo'):
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
                cursor = connection.cursor(dictionary=True)
                
                # Verificar si el huésped ya existe
                query = """SELECT id FROM huespedes WHERE tipo_documento = %s AND num_documento = %s"""
                cursor.execute(query, (self.tipo_documento, self.num_documento))
                result = cursor.fetchone()

                if result:
                    # Si existe, actualizar su estado a 'activo'
                    query = """UPDATE huespedes SET estado = 'activo' WHERE ID = %s"""
                    cursor.execute(query, (result['id'],))
                    connection.commit()
                    return result['id']  # Devuelve el ID del huésped existente

                else:
                    # Si no existe, insertar un nuevo registro
                    query = """INSERT INTO huespedes (nombre, apellido, email, telefono, pais, tipo_documento, num_documento, estado)
                               VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"""
                    data = (self.nombre, self.apellido, self.email, self.telefono, self.pais, self.tipo_documento, self.num_documento, self.estado)
                    cursor.execute(query, data)
                    connection.commit()
                    self.id = cursor.lastrowid
                    return self.id  # Devuelve el ID del nuevo huésped

            except mysql.connector.Error as e:
                print(f"Error al insertar/actualizar huésped: {e}")
                connection.rollback()
                return None
            finally:
                cursor.close()
                connection.close()
        return None
