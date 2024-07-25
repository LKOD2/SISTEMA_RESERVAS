from conection import conex
import mysql.connector


def get_inicio():
    try:
        connection = conex()
        cursor = connection.cursor(dictionary=True)
        cursor.execute('SELECT estado, COUNT(*) as cantidad FROM habitaciones GROUP BY estado')
        resultado = cursor.fetchall()
        if resultado:
            print(resultado)

            suma = 0
            for i in resultado:
                suma += i["cantidad"]

            dic_todas = {'estado': 'todas', 'cantidad': suma}

            resultado.append(dic_todas)

            return resultado
        else:
            return []
    except Exception as e:
        print(e)
        return []
    finally:
        if connection.is_connected():
            connection.close()

