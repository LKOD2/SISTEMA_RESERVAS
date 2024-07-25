
from conection import conex
import mysql.connector



def validar_hotel(nombre):
    sql = f'SELECT nombre FROM habitaciones WHERE nombre = "{nombre}"'
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


def obtener_hoteles():
    try:
        connection = conex()
        cursor = connection.cursor(dictionary=True)
        cursor.execute('SELECT * FROM hoteles')
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
        

def insertar_hotel(nombre, direccion, estado):

    sql = f'SELECT nombre FROM hoteles WHERE nombre = "{nombre}"'
    conexion = conex()
    try:
        if conexion.is_connected():
            cursor = conexion.cursor()
            cursor.execute(sql)
            resultado = cursor.fetchone()

        if resultado:
            return {'estado': False, 'mensaje': 'El hotel ya existe'}
        else:
            print(nombre, direccion, estado)
            tupla = (nombre, direccion, estado)
            sql = '''insert into hoteles(nombre, direccion, estado) 
                    values(%s, %s, %s)'''
            cursor.execute(sql,tupla)
            if cursor.rowcount > 0:
                conexion.commit()
                return {'estado': True, 'mensaje': f'El hotel {nombre} se creó con exito'}
            else:
                return {'estado': False, 'mensaje': 'No se creó el hotel'}
                
    except mysql.connector.Error as e:
        return {'estado': False, 'mensaje': 'Error del sistema'}
    finally:
        conexion.close()


def editar_hotel(id_hotel, nombre, direccion, estado):
    try:
        sql = 'UPDATE hoteles SET nombre = %s, direccion = %s, estado = %s WHERE ID = %s'
        conection = conex()
        cursor = conection.cursor()
        cursor.execute(sql,(nombre, direccion, estado, id_hotel))
        if cursor.rowcount > 0:
            conection.commit()
            return {'estado': True, 'mensaje': f'El hotel {nombre} se actualizó'}
        else:
            return {'estado': False, 'mensaje': f'El hotel {nombre} no se actualizó'}
    except Exception as e:
        return {'estado': False, 'mensaje': 'Error del sistema'}
    finally:
        conection.close()


def borrar_hotel(id_hotel):
    try:
        sql = 'SELECT estado FROM hoteles WHERE ID = %s'
        conection = conex()
        cursor = conection.cursor(dictionary=True)
        cursor.execute(sql, (id_hotel,))
        resultado = cursor.fetchone()
        if resultado:
            if resultado['estado'] == 'desactivo':
                return {'estado': False, 'mensaje': 'El hotel ya esta desactivo'}
            else:
                sql = 'DELETE FROM hoteles WHERE ID = %s'
                cursor.execute(sql, (id_hotel,))
                conection.commit()
                if cursor.rowcount > 0:
                    return {'estado': True, 'mensaje': f'El hotel {id_hotel} ha sido eliminado'}
        else:
            return {'estado': False, 'mensaje': 'No se encontró El hotel'}
    except Exception as e:
        return {'estado': False, 'mensaje': 'Error del sistema'}
    finally:
        conection.close()

