from flask import Flask, jsonify, render_template, request, redirect, url_for, flash, session
from db.Salida import finalizar
from db.recepcion import insert_reserva
from db.login_trab import ingreso
from db.usuarios import obtener_users, validar_user, insertar_user, editar_user, borrar_user
from db.huespedes import filtrar_huespedes, obtener_huespedes, validar_huesped, insertar_huesped, editar_huesped, borrar_huesped
from db.productos import obtener_productos, validar_producto, insertar_producto, editar_producto, borrar_producto
from db.hoteles import obtener_hoteles, insertar_hotel, editar_hotel, borrar_hotel

from db.habitaciones import obtener_hab, obtener_habitaciones, obtener_disponibles, obtener_ocupadas, obtener_limpieza, insertar_habitacion, editar_habitacion, borrar_habitacion
from db.inicio import get_inicio

from app import app

from flask_login import login_user, login_required, logout_user, current_user
from db.login_trab import get_user_by_username
from werkzeug.security import generate_password_hash, check_password_hash

from app import admin_requerido

# -----importacion de las clases------

from models import Habitacion, Huesped, Pago, Reserva, Salida


#------------------------------- PAGINA ---------------------------------

@app.route('/pagina-home')
def pagina_home():
    return render_template('pagina/home.html', title='home')

@app.route('/contacto')
def contacto():
    return render_template('pagina/contacto.html', title='Contactanos')

#------------------------------- LOGIN---------------------------------

@app.route('/')
def index():
    return redirect('login')
    
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        usuario = request.form.get('usuario')
        clave = request.form.get('clave')

        respuesta = ingreso(usuario, clave)

        if respuesta['estado'] is True:
            session.permanent = True 
            return redirect(url_for('home'))
        else:
            return jsonify(respuesta)
    return render_template('login_trab.html')
    

# @app.route('/login', methods=['GET', 'POST'])
# def login():
#     if request.method == 'POST':
#         username = request.form.get('usuario')
#         password = request.form.get('clave')
#         user = get_user_by_username(username)

#         if user and check_password_hash(user.clave, password):
#             login_user(user)
#             return redirect(url_for('home'))
#         else:
#             flash('Login Unsuccessful. Please check username and password', 'danger')

#     return render_template('login_trab.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    session.clear()
    return jsonify({'estado': True, 'mensaje': 'Se cerró la sesión'})


#------------------------------- INICIO ---------------------------------

@app.route('/home')
@login_required
def home():
    return render_template('base.html', usuario = current_user.usuario)

@app.route('/inicio')
@login_required
def inicio():
    datos = get_inicio()
    return render_template('inicio.html',data = datos)


@app.route('/get-todas')
@login_required
def get_todas():
    datos = obtener_habitaciones()
    return jsonify(datos)

@app.route('/get-disponibles')
@login_required
def get_disponibles():
    datos = obtener_disponibles()
    return jsonify(datos)

@app.route('/get-ocupadas')
@login_required
def get_ocupadas():
    datos = obtener_ocupadas()
    return jsonify(datos)

@app.route('/get-limpieza')
@login_required
def get_limpieza():
    datos = obtener_limpieza()
    return jsonify(datos)

#----------------------------- GESTION -----------------------------------

@app.route('/recepcion')
@login_required
def get_recepcion():
    datos = obtener_disponibles()
    return render_template('gestion.html', data = datos, titulo = 'Recepción')

@app.route('/salida')
@login_required
def get_salida():
    datos = obtener_ocupadas()
    return render_template('gestion.html', data = datos, titulo = 'Salida')


@app.route('/form-recepcion', methods=['POST'])
@login_required
def get_form_recepcion():
    ID_hab = request.json.get('ID')

    datos = obtener_hab(ID_hab)

    if datos:
        return render_template('form_recepcion.html', data=datos )
    else:
        return render_template('form_recepcion.html', data='No hay habitación' )


# @app.route('/reservar', methods=['POST'])
# @login_required
# def reservar():
#     usuario = current_user.get_id()
#     habitacion = request.json.get('habitacion')
#     huesped1 = request.json.get('huesped1')
#     reserva = request.json.get('reserva')
#     pago = request.json.get('pago')
    
#     print(usuario, habitacion, huesped1, pago, reserva)

#     resultado = insert_reserva(usuario, habitacion, huesped1, pago, reserva)
#     if resultado:
#         return jsonify({'estado': True})
#     else:
#         return jsonify({'estado': False, 'mensaje': 'Error al realizar la reserva'})
    

#-----------------------------------------------------------------------------------------


@app.route('/reservar', methods=['POST'])
@login_required
def reservar():
    usuario = current_user.get_id()
    data = request.json
    habitacion_data = data.get('habitacion')
    huespedes_data = data.get('huespedes', [])
    reserva_data = data.get('reserva')
    pago_data = data.get('pago')
    
    # Crear y guardar pago
    pago = Pago(**pago_data)
    pago_id = pago.insertar()
    
    # Crear y guardar reserva
    reserva = Reserva(habitacion_data['ID'], pago_id, usuario, reserva_data['fechaEntrada'], reserva_data['fechaSalida'], reserva_data['observacion'])
    reserva_id = reserva.insertar()

    # Relacionar huéspedes con la reserva
    for huesped_data in huespedes_data:

        huesped_id = Huesped.obtener_id_existente(huesped_data['tipoDocumento'], huesped_data['numDocumento'])
        
        if not huesped_id:
            huesped = Huesped(**huesped_data)
            huesped_id = huesped.insertar()

        if huesped_id:
            responsable = huesped_data.get('responsable', False)
            reserva.relacionar_huesped(huesped_id, responsable)
    
    # Actualizar estado de la habitación
    Habitacion.actualizar_estado(habitacion_data['ID'], 'ocupada')
    
    if reserva_id and pago_id:
        return jsonify({'estado': True})
    else:
        return jsonify({'estado': False, 'mensaje': 'Error al realizar la reserva'})
    

@app.route('/form-salida', methods=['POST'])
@login_required
def get_form_salida():
    id_hab = request.json.get('ID')
    
    if not id_hab:
        return "ID de habitación no proporcionado", 400
    
    datos_reserva = Salida.obtener_datos_reserva(id_hab)
    datos_habitacion = Salida.obtener_datos_habitacion(id_hab)
    
    if datos_reserva:
        datos_huesped = Salida.obtener_datos_huesped_responsable(datos_reserva['ID'])
        datos_pago = Salida.obtener_datos_pagos(datos_reserva['pagos_id'])
    else:
        datos_huesped = None
        datos_pago = None
    print('-------------------------------------------------------')
    print(datos_reserva)
    print(datos_habitacion)
    print(datos_huesped)

    if datos_reserva and datos_habitacion and datos_huesped and datos_pago:
        datos = {
            'datos_reserva': datos_reserva,
            'datos_habitacion': datos_habitacion,
            'datos_huesped': datos_huesped,
            'datos_pago': datos_pago
        }
        return render_template('form_salida.html', data=datos)
    
    return "Datos incompletos", 400


@app.route('/salida', methods=['POST'])
@login_required
def salida():
    reserva_id = request.form.get('reserva_id')
    multa_pago = request.form.get('multa-pago')

    if not reserva_id:
        return jsonify({'estado': False, 'mensaje': 'ID de reserva no proporcionado'})

    respuesta = finalizar(reserva_id, multa_pago)

    return jsonify(respuesta)

#----------------------------- RESERVAS -----------------------------------

@app.route('/reservas')
@login_required
def get_reserva():
    return render_template('reservas.html')

#----------------------------- PRODUCTOS -----------------------------------

@app.route('/productos')
@login_required
def get_productos():
    data = obtener_productos()
    return render_template('productos.html',data = data)

@app.route('/validar-producto/<num_doc>', methods=['POST'])
@login_required
def validate_producto(num_doc):
    respuesta = validar_producto(num_doc)
    return jsonify(respuesta)


@app.route('/insert-producto', methods=['POST'])
@login_required
def insert_producto():


    nombre = request.form.get('nombre')
    marca = request.form.get('marca')
    detalle = request.form.get('detalle')
    precio = request.form.get('precio')
    cantidad = request.form.get('cantidad')

    print(nombre, marca, detalle, precio, cantidad)

    resultado = insertar_producto(nombre, marca, detalle, precio, cantidad)
    return jsonify(resultado)

@app.route('/edit-producto', methods=['POST'])
@login_required
def edit_producto():

    id = request.form.get('id')
    nombre = request.form.get('nombre')
    marca = request.form.get('marca')
    detalle = request.form.get('detalle')
    precio = request.form.get('precio')
    cantidad = request.form.get('cantidad')

    resultado = editar_producto(id, nombre, marca, detalle, precio, cantidad)
    return jsonify(resultado)

@app.route('/delete-producto', methods=['POST'])
@login_required
def delete_producto():

    data = request.get_json()
    id_huesped = data.get('id')

    if not id_huesped:
        return jsonify({'estado': False, 'mensaje': 'No hay huesped'}), 400

    resultado = borrar_producto(id_huesped)
    return jsonify(resultado)


#------------------------------- HABITACIONES ---------------------------------

@app.route('/habitaciones')
@login_required
def get_habitaciones():
    datos = obtener_habitaciones()
    return render_template('habitaciones.html', data = datos)

@app.route('/insert-habitacion', methods=['POST'])
@login_required
def insert_habitacion():

    numero = request.form.get('numero')
    tipo = request.form.get('tipo')
    estado = request.form.get('estado')
    orientacion = request.form.get('orientacion')
    precio = request.form.get('precio')
    hotel_id = request.form.get('hotel_id')

    resultado = insertar_habitacion(numero, tipo, estado, orientacion, precio, hotel_id)
    return jsonify(resultado)

@app.route('/edit-habitacion', methods=['POST'])
@login_required
def edit_habitacion():

    numero = request.form.get('numero')
    tipo = request.form.get('tipo')
    estado = request.form.get('estado')
    orientacion = request.form.get('orientacion')
    precio = request.form.get('precio')

    resultado = editar_habitacion(numero, tipo, estado, orientacion, precio)
    return jsonify(resultado)

@app.route('/delete-habitacion', methods=['POST'])
@login_required
def delete_habitacion():

    data = request.get_json()
    numero = data.get('numero')

    if not numero:
        return jsonify({'estado': False, 'mensaje': 'No hay habitación'}), 400

    resultado = borrar_habitacion(numero)
    return jsonify(resultado)


@app.route('/recarga/habitaciones')
@login_required
def recargar_habitaciones():
    datos = obtener_habitaciones()
    return render_template('habitaciones.html', data = datos)


#----------------------------- HUESPEDES -----------------------------------


@app.route('/huespedes')
@login_required
def get_huespedes():
    data = obtener_huespedes()
    return render_template('huespedes.html',data = data)

@app.route('/filtrar-huespedes', methods=['GET'])
@login_required
def filtro_huespedes():
    estado = request.args.get('estado', 'activo')
    print(estado)
    datos = filtrar_huespedes(estado)
    print(datos)
    return jsonify(datos)

@app.route('/validar-huesped/<num_doc>', methods=['POST'])
@login_required
def validate_huesped(num_doc):
    respuesta = validar_huesped(num_doc)
    return jsonify(respuesta)


@app.route('/insert-huesped', methods=['POST'])
@login_required
def insert_huesped():

    nombre = request.form.get('nombre')
    apellido = request.form.get('apellido')
    email = request.form.get('email')
    pais = request.form.get('pais')
    telefono = request.form.get('telefono')
    tipo_documento = request.form.get('tipo-doc')
    num_documento = request.form.get('num-doc')

    print(nombre, apellido, email, pais, telefono, tipo_documento, num_documento)

    resultado = insertar_huesped(nombre, apellido, email, pais, telefono, tipo_documento, num_documento)
    return jsonify(resultado)

@app.route('/edit-huesped', methods=['POST'])
@login_required
def edit_huesped():

    id = request.form.get('id')
    nombre = request.form.get('nombre')
    apellido = request.form.get('apellido')
    email = request.form.get('email')
    pais = request.form.get('pais')
    telefono = request.form.get('telefono')
    tipo_documento = request.form.get('tipo-doc')
    num_documento = request.form.get('num-doc')

    resultado = editar_huesped(id, nombre, apellido, email, pais, telefono, tipo_documento, num_documento)
    return jsonify(resultado)

@app.route('/delete-huesped', methods=['POST'])
@login_required
def delete_huesped():

    data = request.get_json()
    id_huesped = data.get('id')

    if not id_huesped:
        return jsonify({'estado': False, 'mensaje': 'No hay huesped'}), 400

    resultado = borrar_huesped(id_huesped)
    return jsonify(resultado)

#----------------------------- USUARIOS -----------------------------------


@app.route('/usuarios', methods=['GET'])
@login_required
@admin_requerido
def get_users():
    estado = request.args.get('estado', 'activo')
    datos = obtener_users(estado)
    return render_template('usuarios.html', data=datos)

@app.route('/filtrar-users', methods=['GET'])
@login_required
@admin_requerido
def filtrar_users():
    estado = request.args.get('estado', 'activo')
    datos = obtener_users(estado)
    return jsonify(datos)


@app.route('/validar-user/<usuario>', methods=['POST'])
@login_required
@admin_requerido
def validate_user(usuario):
    print(usuario)
    respuesta = validar_user(usuario)
    return respuesta


@app.route('/insert-user', methods=['POST'])
@login_required
@admin_requerido
def insert_user():

    usuario = request.form.get('usuario')
    nombre = request.form.get('nombre')
    apellido = request.form.get('apellido')
    clave = request.form.get('clave')
    email = request.form.get('email')
    tipo = request.form.get('tipo')
    estado = request.form.get('estado')

    print(usuario, nombre, apellido, email, clave, tipo, estado)

    resultado = insertar_user(usuario, nombre, apellido, email, clave, tipo, estado)
    return jsonify(resultado)

@app.route('/edit-user', methods=['POST'])
@login_required
@admin_requerido
def edit_user():

    usuario = request.form.get('usuario')
    nombre = request.form.get('nombre')
    apellido = request.form.get('apellido')
    clave = request.form.get('clave')
    email = request.form.get('email')
    tipo = request.form.get('tipo')
    estado = request.form.get('estado')

    resultado = editar_user(usuario, nombre, apellido, email, tipo, estado)
    return jsonify(resultado)

@app.route('/delete-user', methods=['POST'])
@login_required
@admin_requerido
def delete_user():

    data = request.get_json()
    usuario = data.get('usuario')

    if not usuario:
        return jsonify({'estado': False, 'mensaje': 'No hay usuario'}), 400

    resultado = borrar_user(usuario)
    return jsonify(resultado)

#----------------------------- HOTELES -----------------------------------

@app.route('/hoteles')
@login_required
def get_hoteles():
    datos = obtener_hoteles()
    return render_template('hoteles.html', data = datos)

@app.route('/insert-hotel', methods=['POST'])
@login_required
def insert_hotel():

    nombre = request.form.get('nombre')
    direccion = request.form.get('direccion')
    estado = request.form.get('estado')

    resultado = insertar_hotel(nombre, direccion, estado)
    return jsonify(resultado)

@app.route('/edit-hotel', methods=['POST'])
@login_required
def edit_hotel():

    id_hotel = request.form.get('id-hotel')
    nombre = request.form.get('nombre')
    direccion = request.form.get('direccion')
    estado = request.form.get('estado')

    resultado = editar_hotel(id_hotel, nombre, direccion, estado)
    return jsonify(resultado)

@app.route('/delete-hotel', methods=['POST'])
@login_required
def delete_hotel():

    data = request.get_json()
    id_hotel = data.get('id_hotel')
    print(id_hotel)

    if not id_hotel:
        return jsonify({'estado': False, 'mensaje': 'No hay hotel'}), 400

    resultado = borrar_hotel(id_hotel)
    print(resultado)
    return jsonify(resultado)









