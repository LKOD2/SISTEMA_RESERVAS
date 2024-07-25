from conection import conex
import mysql.connector

def validar_huesped(id):
    sql = f'SELECT nombre, apellido FROM huespedes WHERE id = "{id}"'
    try:
        conection = conex()
        cursor = conection.cursor()
        cursor.execute(sql)
        resultado = cursor.fetchone()
        if resultado:
            return {'estado': True, 'mensaje': f'Huesped encontrado'}
        else:
            return {'estado': False, 'mensaje': f'Huesped no encontrado'}
    except mysql.connector.Error as e:
        return {'estado': False, 'mensaje': f'{e}'}
    finally:
        conection.close()


def obtener_huespedes():
    try:
        connection = conex()
        cursor = connection.cursor(dictionary=True)
        cursor.execute('''SELECT h.*, ha.numero AS numero_hab
                            FROM huespedes h
                            JOIN hues_res hr ON h.ID = hr.huespedes_id
                            JOIN reservas r ON hr.reservas_id = r.ID
                            JOIN habitaciones ha ON r.habitaciones_id = ha.ID
                            WHERE h.estado = "activo"
                            GROUP BY h.nombre, ha.numero
                       ''')
        resultado = cursor.fetchall()
        if resultado:
            return resultado
        else:
            return []
    except Exception as e:
        return print(e)
    finally:
        if connection.is_connected():
            connection.close()

def filtrar_huespedes(estado='activo'):
    try:
        connection = conex()
        cursor = connection.cursor(dictionary=True)
        if estado == 'todos':
            query = '''SELECT h.*, ha.numero AS numero_hab
                            FROM huespedes h
                            JOIN hues_res hr ON h.ID = hr.huespedes_id
                            JOIN reservas r ON hr.reservas_id = r.ID
                            JOIN habitaciones ha ON r.habitaciones_id = ha.ID
                            GROUP BY h.nombre, ha.numero
                       '''
        else:
            query = '''SELECT h.*, ha.numero AS numero_hab
                            FROM huespedes h
                            JOIN hues_res hr ON h.ID = hr.huespedes_id
                            JOIN reservas r ON hr.reservas_id = r.ID
                            JOIN habitaciones ha ON r.habitaciones_id = ha.ID
                            WHERE h.estado = %s
                            GROUP BY h.nombre, ha.numero
                       '''
        cursor.execute(query, (estado,) if estado != 'todos' else ())
        resultado = cursor.fetchall()
        return resultado if resultado else []
    except Exception as e:
        return []
    finally:
        if connection.is_connected():
            connection.close()
        

def insertar_huesped(nombre, apellido, email, pais, telefono, tipo_doc, num_doc):

    sql = f'SELECT nombre FROM huespedes WHERE num_documento = "{num_doc}"'
    conexion = conex()
    try:
        if conexion.is_connected():
            cursor = conexion.cursor()
            cursor.execute(sql)
            resultado = cursor.fetchone()

        if resultado:
            return {'estado': False, 'mensaje': f'El huesped {nombre} {apellido} ya existe'}
        else:
            tupla = (nombre, apellido, email, pais, telefono, tipo_doc, num_doc)
            sql = '''insert into huespedes(nombre, apellido, email, pais, telefono, tipo_documento, num_documento) 
                    values(%s, %s, %s, %s, %s, %s, %s)'''
            cursor.execute(sql,tupla)
            if cursor.rowcount > 0:
                conexion.commit()
                return {'estado': True, 'mensaje': 'El huesped se creó con exito'}
            else:
                return {'estado': False, 'mensaje': 'No se creó el huesped'}
                
    except mysql.connector.Error as e:
        return {'estado': False, 'mensaje': 'Error del sistema'}
    finally:
        conexion.close()


def editar_huesped(id, nombre, apellido, email, pais, telefono, tipo_doc, num_doc):
    try:
        sql = 'UPDATE huespedes SET nombre = %s, apellido = %s, email = %s, pais = %s, telefono = %s, tipo_documento = %s, num_documento = %s WHERE id = %s'
        conection = conex()
        cursor = conection.cursor()
        cursor.execute(sql,(nombre, apellido, email, pais, telefono, tipo_doc, num_doc,id))
        if cursor.rowcount > 0:
            conection.commit()
            return {'estado': True, 'mensaje': f'El huesped {nombre} {apellido} se actualizó'}
        else:
            return {'estado': False, 'mensaje': f'El huesped {nombre} {apellido} no se actualizó'}
    except Exception as e:
        return {'estado': False, 'mensaje': 'Error del sistema'}
    finally:
        conection.close()


def borrar_huesped(id):
    try:
        sql = 'SELECT nombre FROM huespedes WHERE id = %s'
        conection = conex()
        cursor = conection.cursor()
        cursor.execute(sql, (id,))
        resultado = cursor.fetchone()
        if resultado:
            sql = 'DELETE FROM huespedes WHERE id = %s'
            cursor.execute(sql, (id,))
            conection.commit()
            if cursor.rowcount > 0:
                return {'estado': True, 'mensaje': f'El huesped ha sido eliminado'}
        else:
            return {'estado': False, 'mensaje': 'No se encontró el huesped'}
    except Exception as e:
        return {'estado': False, 'mensaje': 'Error del sistema'}
    finally:
        conection.close()