//------------------------ cargar huespedes----------------------



function cargarHuespedes() {
    fetch('/huespedes')
    .then(respuesta => respuesta.text())
    .then(huespedes => {
        const conthuespedes = document.getElementById('main');
        conthuespedes.innerHTML = huespedes

        //--------------------------------------------------------

        editarhuesped()
        crearhuesped()
        borrarhuesped();
        filtrarHuespedes();

    });
};

function modalHuespedes(){
    const modalCrearHuesped = document.getElementById("cont-form-crear-huesped");
    const modalEditHuesped = document.getElementById('cont-form-edit-huesped');
    const openModalBtn = document.getElementById('boton-crear-huesped');


    let listaIconoCerrar = document.querySelectorAll('.icono-cerrar');
    listaIconoCerrar.forEach(icono =>{
        icono.addEventListener('click', ()=>{
            modalCrearHuesped.classList.remove('activo');
            modalEditHuesped.classList.remove('activo');
        })
    })

    openModalBtn.onclick = function() {
        modalCrearHuesped.classList.add('activo');
        modalEditHuesped.classList.remove('activo');
    }

    // Función para cerrar los modales al hacer clic fuera de su contenido

    window.onclick = function(event) {
        if (event.target === modalCrearHuesped) {
            modalCrearHuesped.classList.remove('activo');
        } else if (event.target === modalEditHuesped) {
            modalEditHuesped.classList.remove('activo');
        }
    }
}


//------------------------ CREAR huesped ----------------------


function crearhuesped(){

    document.getElementById('crear-huesped-form').addEventListener('submit', async function(event){
        event.preventDefault();

        var formData = new FormData(this);


        var nombre = formData.get('nombre');
        var apellido = formData.get('apellido');
        var email = formData.get('email');
        var pais = formData.get('pais')
        var telefono = formData.get('telefono');
        var tipoDoc = formData.get('tipo-doc');
        var numDoc = formData.get('num-doc');

        console.log('data del form: ',nombre, apellido, email, pais, telefono, tipoDoc, numDoc, formData);

        console.log(formData);

        validarDatosHuesped(nombre, apellido, email, pais, telefono, tipoDoc, numDoc, formData);



    });

};

function insertarHuesped(datos){

    fetch('/insert-huesped', { method: 'POST', body: datos })
    .then(respuesta => respuesta.json())
    .then(data => {

        if(data.estado){
            alert(data.mensaje);
            console.log('estado:', data);
            cargarHuespedes();
        }else{
            alert(data.mensaje);
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });

};



//------------------------ EDITAR huesped ----------------------


function editarhuesped(){
    document.querySelectorAll('.acciones.editar.huesped').forEach(button => {
        button.addEventListener('click', function() {

            console.log('editar huesped'); //editar huesped

            // Obtiene los datos del huesped de la fila correspondiente
            const id = button.getAttribute('data-huesped');
            const fila = button.closest('tr');
            const nombre = fila.querySelector('td:nth-child(1)').innerText;
            const apellido = fila.querySelector('td:nth-child(2)').innerText;
            const email = fila.querySelector('td:nth-child(3)').innerText;
            const pais = fila.querySelector('td:nth-child(4)').innerText;
            const telefono = fila.querySelector('td:nth-child(5)').innerText;
            const tipoDoc = fila.querySelector('td:nth-child(6)').innerText;
            const numDoc = fila.querySelector('td:nth-child(7)').innerText;


            // Llena el formulario de edición con los datos del huesped
            document.getElementById('edit-id-huesped').value = id;
            document.getElementById('edit-nombre-huesped').value = nombre;
            document.getElementById('edit-apellido-huesped').value = apellido;
            document.getElementById('edit-email-huesped').value = email;
            document.getElementById('edit-pais-huesped').value = pais;
            document.getElementById('edit-telefono-huesped').value = telefono;
            document.getElementById('edit-tipo-doc-huesped').value = tipoDoc;
            document.getElementById('edit-num-doc-huesped').value = numDoc;

            // Muestra el formulario de edición
            document.getElementById('cont-form-edit-huesped').classList.toggle('activo');
        });
    });

    // Maneja el envío del formulario de edición
    document.getElementById('edit-huesped-form').addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(this);
        fetch('/edit-huesped', { method: 'POST', body: formData})
        .then(response => response.json())
        .then(data => {
            if (data.estado) {
                alert(data.mensaje);
                cargarHuespedes()
                document.getElementById('cont-form-edit-huesped').classList.remove('activo');
            } else {
                alert(data.mensaje);
            }
        });
    });

};

//------------------------ BORRAR huesped ----------------------


function borrarhuesped(){
    document.querySelectorAll('.acciones.borrar.huesped').forEach(boton => {
        boton.addEventListener('click', function() {

            console.log('borrar huesped'); //borrar huesped

            const idHuesped = boton.getAttribute('data-huesped');
            
            if (confirm(`¿Estás seguro de que quieres eliminar el huesped?`)) {

                fetch('/delete-huesped', { method: 'POST', 
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ id:idHuesped })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.estado) {
                        alert(data.mensaje);
                        boton.closest('tr').remove(); // Eliminar la fila del huesped de la tabla
                    } else {
                        alert(data.mensaje);
                    }
                })
                .catch(error => console.error('Error:', error));
            }
        });
    });
};



//------------------------ VALIDAR huesped ----------------------


function validarDatosHuesped(nombre, apellido, email, pais, telefono, tipoDoc, numDoc, formData) {
    console.log(nombre, apellido, email, pais, telefono, tipoDoc, numDoc, formData);

    const regex = /[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/;
    const telefonoRegex = /^\d{9}$/;  
    const numDocRegex = /^\d{9,10}$/; 

    fetch(`/validar-huesped/${numDoc}`, { method: 'POST' })
        .then(respuesta => respuesta.json())
        .then(respuesta => {
            console.log(respuesta);

            let errores = [];

            if (respuesta.estado === true) {
                errores.push(respuesta.mensaje);
            } else {
                if (nombre.length < 4) {
                    errores.push('El nombre es muy corto');
                    document.getElementById('imput-nombre-huesped').classList.add('error');
                } else if (nombre.length > 15) {
                    errores.push('El nombre es muy largo');
                    document.getElementById('imput-nombre-huesped').classList.add('error');
                } else if (regex.test(nombre)) {
                    errores.push('El nombre no puede contener símbolos o números');
                    document.getElementById('imput-nombre-huesped').classList.add('error');
                } else {
                    document.getElementById('imput-nombre-huesped').classList.remove('error');
                }

                if (apellido.length < 4) {
                    errores.push('El apellido es muy corto');
                    document.getElementById('imput-apellido-huesped').classList.add('error');
                } else if (apellido.length > 15) {
                    errores.push('El apellido es muy largo');
                    document.getElementById('imput-apellido-huesped').classList.add('error');
                } else if (regex.test(apellido)) {
                    errores.push('El apellido no puede contener símbolos o números');
                    document.getElementById('imput-apellido-huesped').classList.add('error');
                } else {
                    document.getElementById('imput-apellido-huesped').classList.remove('error');
                }

                if (pais && regex.test(pais)) {
                    errores.push('El pais no puede contener símbolos o números');
                    document.getElementById('imput-pais-huesped').classList.add('error');
                } else {
                    document.getElementById('imput-pais-huesped').classList.remove('error');
                }

                if (telefono && !telefonoRegex.test(telefono)) {
                    errores.push('El telefono debe tener solo 9 digitos');
                    document.getElementById('imput-telefono-huesped').classList.add('error');
                } else {
                    document.getElementById('imput-telefono-huesped').classList.remove('error');
                }

                if (numDoc && !numDocRegex.test(numDoc)) {
                    errores.push('El numero de documento debe contener solo 10 digitos');
                    document.getElementById('imput-num-doc-huesped').classList.add('error');
                } else {
                    document.getElementById('imput-num-doc-huesped').classList.remove('error');
                }

                if (errores.length > 0) {
                    alert(errores.join('\n'));
                } else {
                    insertarHuesped(formData);
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Ocurrió un error al verificar el huesped');
        });
}

//------------------------ FILTRAR USUARIOS ----------------------

function filtrarHuespedes() {

    const selectHuesped = document.getElementById('select-huespedes');
    selectHuesped.addEventListener('change', (event) => {
        const estado = event.target.value;
        recargarHuespedes(estado);
    });
};

function recargarHuespedes(estado='activo') {
    console.log('estado huesped', estado);
    fetch(`/filtrar-huespedes?estado=${estado}`)
    .then(respuesta => respuesta.json())
    .then(huespedes => {
        const contHuespedes = document.getElementById('body-tabla-huesped')
        console.log(huespedes);
        huespedesHTML = '';

        huespedes.forEach(huesped => {
            let huespedHTML = `
                <tr>
                    <td>${huesped.nombre}</td>
                    <td>${huesped.apellido}</td>
                    <td>${huesped.email}</td>
                    <td>${huesped.pais}</td>
                    <td>${huesped.telefono}</td>
                    <td>${huesped.tipo_documento}</td>
                    <td>${huesped.num_documento}</td>
                    <td><div class="estado ${huesped.estado}">${huesped.estado}</div></td>
                    <td>${huesped.numero_hab}</td>

                </tr>
            `;
            huespedesHTML += huespedHTML;
        });

        contHuespedes.innerHTML = huespedesHTML
        cantidadRegistrosHuesped(huespedes.length)
    })
};


function cantidadRegistrosHuesped(cantidad){
    const cantRegElement = document.getElementById('cant-reg-huespedes');
    cantRegElement.innerHTML = cantidad + ' ' +'Registros'
}