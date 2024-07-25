

//------------------------ LISTAR USUARIOS ----------------------

function cargarUsuarios(estado = 'activo') {
    fetch(`/usuarios?estado=${estado}`)
        .then(respuesta => {
            if (respuesta.status === 403) {
                return respuesta.text().then(texto => {
                    document.getElementById('main').innerHTML = texto;
                    throw new Error('No autorizado');
                });
            }
            return respuesta.text();
        })
        .then(usuarios => {
            const contUsuarios = document.getElementById('main');
            contUsuarios.innerHTML = usuarios;

            //----------------------------------------------------------------

            modalUser();
            editarUser();
            crearUser();
            borrarUser();
            filtrarUsuarios();
        })
        .catch(error => {
            console.error('Error al cargar usuarios:', error);
        });
};

//------------------------ MANEJO MODAL ----------------------

function modalUser(){

    const modalCrearUser = document.getElementById("cont-form-crear-user");
    const modalEditUser = document.getElementById('cont-form-edit-user');
    const openModalBtn = document.getElementById('boton-crear-user');


    let listaIconoCerrar = document.querySelectorAll('.icono-cerrar');
    listaIconoCerrar.forEach(icono =>{
        icono.addEventListener('click', ()=>{
            modalCrearUser.classList.remove('activo');
            modalEditUser.classList.remove('activo');
        })
    })

    openModalBtn.onclick = function() {
        modalCrearUser.classList.add('activo');
        modalEditUser.classList.remove('activo');
    }

    // Función para cerrar los modales al hacer clic fuera de su contenido

    window.onclick = function(event) {
        if (event.target === modalCrearUser) {
            modalCrearUser.classList.remove('activo');
        } else if (event.target === modalEditUser) {
            modalEditUser.classList.remove('activo');
        }
    }
}

//------------------------ CREAR USUARIOS ----------------------


function crearUser(){

    document.getElementById('crear-user-form').addEventListener('submit', async function(event){
        event.preventDefault();

        var formData = new FormData(this);

        var usuario = formData.get('usuario');
        var nombre = formData.get('nombre');
        var apellido = formData.get('apellido');
        var clave = formData.get('clave')
        var email = formData.get('email');
        var tipo = formData.get('tipo');
        var estado = formData.get('estado');

        validarDatosUser(usuario, nombre, apellido, clave, email, tipo, formData);


    });

};

function insertarUser(datos){

    fetch('/insert-user', { method: 'POST', body: datos })
    .then(respuesta => respuesta.json())
    .then(data => {

        if(data.estado){
            alert(data.mensaje);
            cargarUsuarios();
        }else{
            alert(data.mensaje);
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });

};



//------------------------ EDITAR USUARIOS ----------------------


function editarUser(){
    document.querySelectorAll('.acciones.editar.user').forEach(button => {
        button.addEventListener('click', function() {

            // Obtiene los datos del usuario de la fila correspondiente
            const usuario = button.getAttribute('data-usuario');
            const fila = button.closest('tr');
            const nombre = fila.querySelector('td:nth-child(2)').innerText;
            const apellido = fila.querySelector('td:nth-child(3)').innerText;
            const email = fila.querySelector('td:nth-child(4)').innerText;
            const tipo = fila.querySelector('td:nth-child(5)').innerText;
            const estado = fila.querySelector('td:nth-child(6)').innerText;


            // Llena el formulario de edición con los datos del usuario
            document.getElementById('edit-usuario').value = usuario;
            document.getElementById('edit-nombre').value = nombre;
            document.getElementById('edit-apellido').value = apellido;
            document.getElementById('edit-email').value = email;
            document.getElementById('edit-tipo').value = tipo;
            document.getElementById('edit-estado').value = estado;

            // Muestra el formulario de edición
            document.getElementById('cont-form-edit-user').classList.toggle('activo');
        });
    });

    document.getElementById('edit-user-form').addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(this);
        
        fetch('/edit-user', { method: 'POST', body: formData})
        .then(response => response.json())
        .then(data => {
            if (data.estado) {
                alert(data.mensaje);
                cargarUsuarios()
                document.getElementById('cont-form-edit-user').classList.remove('activo');
            } else {
                alert(data.mensaje);
            }
        });
    });

};

//------------------------ BORRAR USUARIOS ----------------------

function borrarUser(){
    document.querySelectorAll('.acciones.borrar.user').forEach(boton => {
        boton.addEventListener('click', function() {

            const usuario = boton.getAttribute('data-usuario');
            
            if (confirm(`¿Estás seguro de que quieres eliminar el usuario ${usuario}?`)) {

                fetch('/delete-user', { method: 'POST', 
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ usuario: usuario })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.estado) {
                        alert(data.mensaje);
                        boton.closest('tr').remove(); // Eliminar la fila del usuario de la tabla
                    } else {
                        alert(data.mensaje);
                    }
                })
                .catch(error => console.error('Error:', error));
            }
        });
    });
};

//------------------------ VALIDAR USUARIOS ----------------------

function validarDatosUser(usuario, nombre, apellido, clave, email, tipo, formData) {
    console.log('lalal', formData);


    const datos = {usuario:usuario, nombre:nombre, apellido:apellido, clave:clave, email:email, tipo:tipo}

    console.log(datos);

    const regex = /[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/;
    const passwordRegex = /^\d{4}$/;  

    fetch(`/validar-user/${usuario}`, { method: 'POST' })
        .then(respuesta => respuesta.text())
        .then(respuesta => {

            let errores = [];

            if (respuesta === 'true') {

                errores.push('El usuario ya existe');
                document.getElementById('imput-user').classList.add('error');
            } else {
                document.getElementById('imput-user').classList.remove('error');
            }

            if (nombre.length < 4) {
                errores.push('El nombre es muy corto');
                document.getElementById('imput-nombre-user').classList.add('error');
            }else if (nombre.length > 15){
                errores.push('El nombre es muy largo');
                document.getElementById('imput-nombre-user').classList.add('error');
            } else if (regex.test(nombre)) {
                errores.push('El nombre no puede contener símbolos o números');
                document.getElementById('imput-nombre-user').classList.add('error');
            } else {
                document.getElementById('imput-nombre-user').classList.remove('error');
            }

            if (apellido.length < 4) {
                errores.push('El apellido es muy corto');
                document.getElementById('imput-apellido-user').classList.add('error');
            }else if (apellido.length > 15){
                errores.push('El apellido es muy largo');
                document.getElementById('imput-apellido-user').classList.add('error');
            } else if (regex.test(apellido)) {
                errores.push('El apellido no puede contener símbolos o números');
                document.getElementById('imput-apellido-user').classList.add('error');
            } else {
                document.getElementById('imput-apellido-user').classList.remove('error');
            }

            if (!passwordRegex.test(clave)) {
                errores.push('La contraseña debe tener 4 dígitos numéricos');
                document.getElementById('imput-clave-user').classList.add('error');
            } else {
                document.getElementById('imput-clave-user').classList.remove('error');
            }
            if (errores.length > 0) {
                alert(errores.join('\n'));
            } else {
                insertarUser(formData)
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Ocurrió un error al verificar el usuario');
        });
};

//------------------------ FILTRAR USUARIOS ----------------------

function filtrarUsuarios() {

    const selectUsuarios = document.getElementById('select-usuarios');
    selectUsuarios.addEventListener('change', (event) => {
        const estado = event.target.value;
        recargarUser(estado);
    });
};

function recargarUser(estado='activo') {
    console.log('estado', estado);
    fetch(`/filtrar-users?estado=${estado}`)
    .then(respuesta => respuesta.json())
    .then(usuarios => {
        const contUsuarios = document.getElementById('body-tabla-user')

        usuariosHTML = '';

        usuarios.forEach(usuario => {
            let usuarioHTML = `
                <tr>
                    <td>${usuario.usuario}</td>
                    <td>${usuario.nombre}</td>
                    <td>${usuario.apellido}</td>
                    <td>${usuario.email}</td>
                    <td>${usuario.rol}</td>
                    <td><div class="estado ${usuario.estado}">${usuario.estado}</div></td>
                    <td>
                        <button class="acciones editar user" id="boton-editar" data-usuario="${ usuario.usuario }" type="button"><i class='bx bxs-edit-alt'></i></button>
                        <button class="acciones borrar user" id="boton-borrar" data-usuario="${ usuario.usuario }" type="button"><i class='bx bx-x'></i></button>
                    </td>
                </tr>
            `;
            usuariosHTML += usuarioHTML;
        });

        contUsuarios.innerHTML = usuariosHTML

        editarUser();
        borrarUser();
        cantidadRegistrosUser(usuarios.length)
    })
};

function cantidadRegistrosUser(cantidad){
    const cantRegElement = document.getElementById('cant-reg-users');
    cantRegElement.innerHTML = cantidad + ' ' +'Registros'
}