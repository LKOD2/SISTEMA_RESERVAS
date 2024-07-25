from conection import conex
import mysql.connector

from flask_login import login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from models.user import User

def ingreso(usuario, clave):
    conexion = conex()
    try:
        sql = 'SELECT * FROM usuarios WHERE usuario = %s'
        cursor = conexion.cursor(dictionary=True)
        cursor.execute(sql, (usuario,))
        user_data = cursor.fetchone()
        if user_data:

            user = User(user_data['usuario'], user_data['clave'], user_data['rol'])

            if user and check_password_hash(user.clave, clave):
                login_user(user)
                return  {'estado': True, 'mensaje': 'Ingreso exitoso'}
            else:
                return  {'estado': False, 'mensaje': 'El usuario o contraseña no son validos'}
 
        else:
            return  {'estado': False, 'mensaje': 'El usuario no existe'}
    except mysql.connector.Error as e:
        return {'estado': False, 'mensaje': 'Error al verificar el usuario'}
    finally:
        conexion.close()


def get_user_by_username(usuario):
    conn = conex()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT * FROM usuarios WHERE usuario = %s', (usuario,))
    user_data = cursor.fetchone()
    cursor.close()
    conn.close()
    if user_data:
        return User(user_data['usuario'], user_data['clave'], user_data['rol'])
    return None

