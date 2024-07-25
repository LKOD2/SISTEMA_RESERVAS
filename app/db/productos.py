from conection import conex
import mysql.connector

def validar_producto(id):
    sql = f'SELECT nombre FROM productos WHERE id = "{id}"'
    try:
        conection = conex()
        cursor = conection.cursor()
        cursor.execute(sql)
        resultado = cursor.fetchone()
        if resultado:
            return {'estado': True, 'mensaje': f'producto encontrado'}
        else:
            return {'estado': False, 'mensaje': f'producto no encontrado'}
    except mysql.connector.Error as e:
        return {'estado': False, 'mensaje': f'{e}'}
    finally:
        conection.close()


def obtener_productos():
    try:
        connection = conex()
        cursor = connection.cursor(dictionary=True)
        cursor.execute('SELECT * FROM productos')
        resultado = cursor.fetchall()
        if resultado:
            return resultado
        else:
            return {'estado': False, 'mensaje': f'No hay productos'}
    except Exception as e:
        print(e)
        return {'estado': False, 'mensaje': f'{e}'}
    finally:
        if connection.is_connected():
            connection.close()
        

def insertar_producto(nombre, marca, detalle, precio, cantidad):

    sql = f'SELECT nombre FROM productos WHERE nombre = "{nombre}"'
    conexion = conex()
    try:
        if conexion.is_connected():
            cursor = conexion.cursor()
            cursor.execute(sql)
            resultado = cursor.fetchone()

        if resultado:
            return {'estado': False, 'mensaje': f'El producto {nombre} ya existe'}
        else:
            tupla = (nombre, marca, detalle, precio, cantidad)
            sql = '''insert into productos(nombre, marca, detalle, precio, cantidad) 
                    values(%s, %s, %s, %s, %s)'''
            cursor.execute(sql,tupla)
            if cursor.rowcount > 0:
                conexion.commit()
                return {'estado': True, 'mensaje': 'El producto se creó con exito'}
            else:
                return {'estado': False, 'mensaje': 'No se creó el producto'}
                
    except mysql.connector.Error as e:
        return {'estado': False, 'mensaje': 'Error del sistema'}
    finally:
        conexion.close()


def editar_producto(id, nombre, marca, detalle, precio, cantidad):
    print(id, nombre, marca, detalle, precio, cantidad)
    try:
        sql = 'UPDATE productos SET nombre = %s, marca = %s, detalle = %s, precio = %s, cantidad = %s WHERE id = %s'
        conection = conex()
        cursor = conection.cursor()
        cursor.execute(sql,(nombre, marca, detalle, precio, cantidad,id))
        if cursor.rowcount > 0:
            conection.commit()
            return {'estado': True, 'mensaje': f'El producto {nombre} se actualizó'}
        else:
            return {'estado': False, 'mensaje': f'El producto {nombre} no se actualizó'}
    except Exception as e:
        return {'estado': False, 'mensaje': 'Error del sistema'}
    finally:
        conection.close()


def borrar_producto(id):
    try:
        sql = 'SELECT nombre FROM productos WHERE id = %s'
        conection = conex()
        cursor = conection.cursor()
        cursor.execute(sql, (id,))
        resultado = cursor.fetchone()
        if resultado:
            sql = 'DELETE FROM productos WHERE id = %s'
            cursor.execute(sql, (id,))
            conection.commit()
            if cursor.rowcount > 0:
                return {'estado': True, 'mensaje': f'El producto ha sido eliminado'}
        else:
            return {'estado': False, 'mensaje': 'No se encontró el producto'}
    except Exception as e:
        return {'estado': False, 'mensaje': 'Error del sistema'}
    finally:
        conection.close()