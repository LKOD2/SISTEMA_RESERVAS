
from conection import conex
import mysql.connector

def obtener_hab(ID):
    sql = f'SELECT * FROM habitaciones WHERE ID = "{ID}"'
    try:
        conection = conex()
        cursor = conection.cursor(dictionary=True)
        cursor.execute(sql)
        resultado = cursor.fetchone()
        if resultado:
            return resultado
        else:
            return None
    except mysql.connector.Error as e:
        return f'{e}'
    finally:
        conection.close()

def validar_hab(numero):
    sql = f'SELECT numero FROM habitaciones WHERE numero = "{numero}"'
    try:
        conection = conex()
        cursor = conection.cursor()
        cursor.execute(sql)
        resultado = cursor.fetchone()
        if resultado:
            print(resultado)
            return 'true'
        else:
            print('es falso')
            return 'false'
    except mysql.connector.Error as e:
        print(e)
        return f'{e}'
    finally:
        conection.close()


def obtener_habitaciones():
    try:
        connection = conex()
        cursor = connection.cursor(dictionary=True)
        cursor.execute('SELECT * FROM habitaciones ORDER BY numero ASC')
        resultado = cursor.fetchall()
        if resultado:
            return resultado
        else:
            return []
    except Exception as e:
        print(e)
        return []
    finally:
        if connection.is_connected():
            connection.close()

def obtener_disponibles():
    try:
        connection = conex()
        cursor = connection.cursor(dictionary=True)
        cursor.execute('SELECT * FROM habitaciones WHERE estado = "disponible" ORDER BY numero ASC')
        resultado = cursor.fetchall()
        if resultado:
            return resultado
        else:
            return []
    except Exception as e:
        print(e)
        return []
    finally:
        if connection.is_connected():
            connection.close()

def obtener_ocupadas():
    try:
        connection = conex()
        cursor = connection.cursor(dictionary=True)
        cursor.execute('SELECT * FROM habitaciones WHERE estado = "ocupada" ORDER BY numero ASC')
        resultado = cursor.fetchall()
        if resultado:
            return resultado
        else:
            return []
    except Exception as e:
        print(e)
        return []
    finally:
        if connection.is_connected():
            connection.close()

def obtener_limpieza():
    try:
        connection = conex()
        cursor = connection.cursor(dictionary=True)
        cursor.execute('SELECT * FROM habitaciones WHERE estado = "limpieza"')
        resultado = cursor.fetchall()
        if resultado:
            return resultado
        else:
            return []
    except Exception as e:
        print(e)
        return []
    finally:
        if connection.is_connected():
            connection.close()



#------------------------------------------------------------------------
        

def insertar_habitacion(numero, tipo, estado, orientacion, precio, hotel_id):

    sql = f'SELECT numero FROM habitaciones WHERE numero = "{numero}"'
    conexion = conex()
    try:
        if conexion.is_connected():
            cursor = conexion.cursor()
            cursor.execute(sql)
            resultado = cursor.fetchone()

        if resultado:
            return {'estado': False, 'mensaje': 'La habitación ya existe'}
        else:
            tupla = (numero, tipo, estado, orientacion, precio, hotel_id)
            sql = '''insert into habitaciones(numero, tipo, estado, orientacion, precio, hoteles_id) 
                    values(%s, %s, %s, %s, %s, %s)'''
            cursor.execute(sql,tupla)
            if cursor.rowcount > 0:
                conexion.commit()
                return {'estado': True, 'mensaje': f'La habitación {numero} se creó con exito'}
            else:
                return {'estado': False, 'mensaje': 'No se creó La habitación'}
                
    except mysql.connector.Error as e:
        return {'estado': False, 'mensaje': 'Error del sistema'}
    finally:
        conexion.close()


def editar_habitacion(numero, tipo, estado, orientacion, precio):
    try:
        sql = 'UPDATE habitaciones SET tipo = %s, estado = %s, orientacion = %s, precio = %s WHERE numero = %s'
        conection = conex()
        cursor = conection.cursor()
        cursor.execute(sql,(tipo, estado, orientacion, precio, numero))
        if cursor.rowcount > 0:
            conection.commit()
            return {'estado': True, 'mensaje': f'La habitación {numero} se actualizó'}
        else:
            return {'estado': False, 'mensaje': f'La habitación {numero} no se actualizó'}
    except Exception as e:
        return {'estado': False, 'mensaje': 'Error del sistema'}
    finally:
        conection.close()


def borrar_habitacion(numero):
    try:
        sql = 'SELECT estado FROM habitaciones WHERE numero = %s'
        conection = conex()
        cursor = conection.cursor(dictionary=True)
        cursor.execute(sql, (numero,))
        resultado = cursor.fetchone()
        if resultado:
            if resultado['estado'] == 'ocupada':
                return {'estado': False, 'mensaje': 'La habitacion esta ocupada'}
            else:
                sql = 'DELETE FROM habitaciones WHERE numero = %s'
                cursor.execute(sql, (numero,))
                conection.commit()
                if cursor.rowcount > 0:
                    return {'estado': True, 'mensaje': f'La habitación {numero} ha sido eliminado'}
        else:
            return {'estado': False, 'mensaje': 'No se encontró La habitación'}
    except Exception as e:
        return {'estado': False, 'mensaje': 'Error del sistema'}
    finally:
        conection.close()

