import mysql.connector


def conex():
    try:
        conexion = mysql.connector.connect(
            host="localhost",
            user="root",
            password="",
            database = "hoteles"
        )
        
        if conexion.is_connected():
            return conexion
        else:
            return None
        
    except mysql.connector.Error as e:
        print(f'Error de conexión: {e}')