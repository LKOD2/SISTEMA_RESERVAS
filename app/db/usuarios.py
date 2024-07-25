from conection import conex
import mysql.connector
from werkzeug.security import generate_password_hash, check_password_hash

def validar_user(usuario):
    sql = f'SELECT usuario FROM usuarios WHERE usuario = "{usuario}"'
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


def obtener_users(estado='activo'):
    try:
        connection = conex()
        cursor = connection.cursor(dictionary=True)
        if estado == 'todos':
            query = 'SELECT usuario, nombre, apellido, email, rol, estado FROM USUARIOS'
        else:
            query = 'SELECT usuario, nombre, apellido, email, rol, estado FROM USUARIOS WHERE estado = %s'
        cursor.execute(query, (estado,) if estado != 'todos' else ())
        resultado = cursor.fetchall()
        return resultado if resultado else []
    except Exception as e:
        return []
    finally:
        if connection.is_connected():
            connection.close()
        

def insertar_user(usuario, nombre, apellido, email, clave, rol, estado):

    sql = f'SELECT usuario, email FROM usuarios WHERE usuario = "{usuario}"'
    conexion = conex()
    try:
        if conexion.is_connected():
            cursor = conexion.cursor()
            cursor.execute(sql)
            resultado = cursor.fetchone()

        if resultado:
            return {'estado': False, 'mensaje': 'El usuario ya existe'}
        else:
            hashed_clave = generate_password_hash(clave)
            print(hashed_clave)
            tupla = (usuario, nombre, apellido, email, hashed_clave, rol, estado)
            sql = '''insert into usuarios(usuario, nombre, apellido, email, clave, rol, estado) 
                    values(%s, %s, %s, %s, %s, %s, %s)'''
            cursor.execute(sql,tupla)
            if cursor.rowcount > 0:
                conexion.commit()
                return {'estado': True, 'mensaje': f'El usuario {usuario} se creó con exito'}
            else:
                return {'estado': False, 'mensaje': 'No se creó el usuario'}
                
    except mysql.connector.Error as e:
        return {'estado': False, 'mensaje': 'Error del sistema'}
    finally:
        conexion.close()


def editar_user(usuario, nombre, apellido, email, rol, estado):
    try:
        sql = 'UPDATE usuarios SET nombre = %s, apellido = %s, email = %s, rol = %s, estado = %s WHERE usuario = %s'
        conection = conex()
        cursor = conection.cursor()
        cursor.execute(sql,(nombre, apellido, email, rol, estado, usuario))
        if cursor.rowcount > 0:
            conection.commit()
            return {'estado': True, 'mensaje': f'El usuario {usuario} se actualizó'}
        else:
            return {'estado': False, 'mensaje': f'El usuario {usuario} no se actualizó'}
    except Exception as e:
        return {'estado': False, 'mensaje': 'Error del sistema'}
    finally:
        conection.close()


def borrar_user(usuario):
    try:
        sql = 'SELECT * FROM usuarios WHERE usuario = %s'
        conection = conex()
        cursor = conection.cursor()
        cursor.execute(sql, (usuario,))
        resultado = cursor.fetchone()
        if resultado:
            sql = 'DELETE FROM usuarios WHERE usuario = %s'
            cursor.execute(sql, (usuario,))
            conection.commit()
            if cursor.rowcount > 0:
                return {'estado': True, 'mensaje': f'El usuario {usuario} ha sido eliminado'}
        else:
            return {'estado': False, 'mensaje': 'No se encontró el usuario'}
    except Exception as e:
        return {'estado': False, 'mensaje': 'Error del sistema'}
    finally:
        conection.close()

# # metodo para actualizar los datos del usuario
# def actualizar_datos(self, usuario):
#     sql = f'SELECT usuario, email FROM usuarios WHERE usuario = "{usuario}"'
#     resultado = pesquisa(sql)
#     if resultado:
#         print(' Tu usuario tiene los siguientes datos '.center(56, '='))
#         print()
#         self.mostrar(resultado)
#         print()
#         campo, valor = super().modificar()
#         if campo and valor:
#             sql = f'UPDATE usuarios SET {campo} = %s WHERE usuario = %s'
#             modificado = update(sql, (valor, usuario))
#             if modificado:
#                 print( f' Se actualizo tu {campo} '.center(56, '='), )
#                 if campo == 'email' or campo == 'usuario':
#                     print( f' Tu nuevo {campo} es: {valor} '.center(56, ' '), )
#                     if campo == 'usuario':
#                         print( ' Al salir deberas ingresar con tu nuevo usuario '.center(56, ' '), )
#                         return valor
#             else:
#                 print( ' No se modifico el usuario '.center(56, 'X'), )
#         else:
#             print( ' No se modifico el usuario '.center(56, 'X'), )

