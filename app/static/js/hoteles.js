
// ---------------------- SELECCIONAR HOTEL ------------------------

function seleccionarHotel() {

    document.querySelectorAll('.acciones.seleccionar').forEach(button => {
        button.addEventListener('click', (event) => {
            console.log('seleccionar hotel');
            const hotelId = event.currentTarget.getAttribute('data-hotel');
            const hotelNombre = event.currentTarget.getAttribute('data-nombre');

            const hotel = { ID: hotelId, nombre: hotelNombre };

            localStorage.setItem('hotel', JSON.stringify(hotel));

            updateHotelNameInTemplateBase(hotelNombre);
        });
    });

    function updateHotelNameInTemplateBase(hotelNombre) {
        const hotelNameElement = document.getElementById('nombre-hotel');
        if (hotelNameElement) {
            hotelNameElement.textContent = hotelNombre;
        }
    }
}


// ---------------------- CARGAR HOTELES ------------------------

function cargarhoteles() {
    fetch('/hoteles')
    .then(respuesta => respuesta.text())
    .then(hoteles => {
        const main = document.getElementById('main');
        main.innerHTML = hoteles

        //----------------------------------------------------------------


        const modalCrearhotel = document.getElementById("cont-form-crear-hotel");
        const modalEdithotel = document.getElementById('cont-form-edit-hotel');
        const btnCrearhotel = document.getElementById('boton-crear-hotel');


        let listaIconoCerrar = document.querySelectorAll('.icono-cerrar');
        listaIconoCerrar.forEach(icono =>{
            icono.addEventListener('click', ()=>{
                modalCrearhotel.classList.remove('activo');
                modalEdithotel.classList.remove('activo');
            })
        })

        btnCrearhotel.onclick = function() {
            modalCrearhotel.classList.add('activo');
            modalEdithotel.classList.remove('activo');
        }

        // Función para cerrar los modales al hacer clic fuera de su contenido

        window.onclick = function(event) {
            if (event.target === modalCrearhotel) {
                modalCrearhotel.classList.remove('activo');
            } else if (event.target === modalEdithotel) {
                modalEdithotel.classList.remove('activo');
            }
        }


        editarHotel();
        crearHotel();
        borrarHotel();
        seleccionarHotel();

    });
};




//------------------------ CREAR hotel ----------------------


function crearHotel() {

    let nombreValido = false;
    let direccionValido = false;

    document.getElementById('crear-nombre-hotel').addEventListener('input', function() {
        const nombre = this.value;
        const inputCrearNombre = document.getElementById('crear-nombre-hotel');
        const errorCrearNombre = document.getElementById('error-crear-nombre-hotel');

        nombreValido = validarNombreHotel(nombre, inputCrearNombre, errorCrearNombre);
    });

    document.getElementById('crear-direccion-hotel').addEventListener('input', function() {
        const direccion = this.value;
        const inputCrearDireccion = document.getElementById('crear-direccion-hotel');
        const errorCrearDireccion = document.getElementById('error-crear-direccion-hotel');

        direccionValido = validarDireccionHotel(direccion, inputCrearDireccion, errorCrearDireccion);
    });

    document.getElementById('crear-hotel-form').addEventListener('submit', async function(event) {
        event.preventDefault();

        // Revalidar los inputs al intentar enviar el formulario
        const nombreInput = document.getElementById('crear-nombre-hotel');
        const direccionInput = document.getElementById('crear-direccion-hotel');
        const estadoInput = document.getElementById('crear-estado-hotel');
        const errorCrearnombre = document.getElementById('error-crear-nombre-hotel');
        const errorCrearDireccion = document.getElementById('error-crear-direccion-hotel');

        const nombre = nombreInput.value;
        const direccion = direccionInput.value;
        const estado = estadoInput.value;


        nombreValido = validarNombreHotel(nombre, nombreInput, errorCrearnombre);
        direccionValido = validarDireccionHotel(direccion, direccionInput, errorCrearDireccion);

        if (nombreValido && direccionValido && estado) {
            var formData = new FormData(this);
            
            fetch('/insert-hotel', { method: 'POST', body: formData })
            .then(respuesta => respuesta.json())
            .then(data => {
        
                if(data.estado){
                    alert(data.mensaje);
                    console.log('estado:', data);
                    cargarhoteles();
                }else{
                    alert(data.mensaje);
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
            
        } else {
            alert('Por favor, corrige los errores antes de enviar el formulario');
        }
    });
}


function validarNombreHotel(nombre, input, label) {
    // Expresión regular para validar que solo haya letras y espacios
    const soloLetras = /^[a-zA-Z\s]+$/;

    if (!soloLetras.test(nombre)) {
        label.innerText = 'El nombre debe contener solo letras y espacios';
        input.classList.add('error');
        return false;
    } else if (nombre.length < 3 || nombre.length > 50) {
        label.innerText = 'El nombre debe tener entre 3 y 50 caracteres';
        input.classList.add('error');
        return false;
    } else {
        label.innerText = '';
        input.classList.remove('error');
        return true;
    }
};



function validarDireccionHotel(direccion, input, label) {
    // Expresión regular para validar que la dirección solo contenga letras, números, espacios, comas y puntos
    const soloDireccion = /^[a-zA-Z0-9\s,\.]+$/;

    if (!soloDireccion.test(direccion)) {
        label.innerText = 'La dirección no es valida';
        input.classList.add('error');
        return false;
    } else if (direccion.length < 5 || direccion.length > 100) {
        label.innerText = 'La dirección debe tener entre 5 y 100 caracteres';
        input.classList.add('error');
        return false;
    } else {
        label.innerText = '';
        input.classList.remove('error');
        return true;
    }
}



//------------------------ EDITAR hotel ----------------------


function editarHotel(){

    let direccionValido = false;

    document.querySelectorAll('.acciones.editar.hab').forEach(button => {
        button.addEventListener('click', function() {

            console.log('editar hotel'); //editar hotel

            // Obtiene los datos del hotel de la fila correspondiente
            const id = button.getAttribute('data-hotel');
            const fila = button.closest('tr');
            const nombre = fila.querySelector('td:nth-child(1)').innerText;
            const tipo = fila.querySelector('td:nth-child(2)').innerText;
            const estado = fila.querySelector('td:nth-child(3)').innerText;
            const orientacion = fila.querySelector('td:nth-child(4)').innerText;
            const direccion = fila.querySelector('td:nth-child(5)').innerText;


            // Llena el formulario de edición con los datos del hotel
            document.getElementById('titulo-form-edit').innerText = `Editar hotel N° ${nombre}`;
            document.getElementById('edit-nombre-hotel').value = nombre;
            document.getElementById('edit-tipo-hotel').value = tipo;
            document.getElementById('edit-estado-hotel').value = estado;
            document.getElementById('edit-orientacion-hotel').value = orientacion;
            document.getElementById('edit-direccion-hotel').value = direccion;

            // Muestra el formulario de edición
            document.getElementById('cont-form-edit-hotel').classList.toggle('activo');

            // Valida los datos
            document.getElementById('edit-direccion-hotel').addEventListener('input', function() {
                const direccion = this.value;
                const inputEditdireccion = document.getElementById('edit-direccion-hotel');
                const errorEditdireccion = document.getElementById('error-edit-direccion-hab');
                direccionValido = validardireccionHotel(direccion, inputEditdireccion, errorEditdireccion);
            });
        });
    });


    document.getElementById('edit-hotel-form').addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(this);

        if (direccionValido) {

            fetch('/edit-hotel', { method: 'POST', body: formData})
            .then(response => response.json())
            .then(data => {
                if (data.estado) {
                    alert(data.mensaje);
                    cargarhoteles()
                    document.getElementById('cont-form-edit-hotel').classList.remove('activo');
                } else {
                    alert(data.mensaje);
                }
            });

        } else {
            alert('Por favor, corrige los errores antes de enviar el formulario');
        }

    });
};

//------------------------ BORRAR hotel ----------------------


function borrarHotel(){
    document.querySelectorAll('.acciones.borrar.hotel').forEach(boton => {
        boton.addEventListener('click', function() {

            console.log('borrar hotel'); //borrar hotel

            const numhotel = boton.getAttribute('data-hotel');
            console.log('borrar hotel', numhotel); 
            
            if (confirm(`¿Estás seguro de que quieres eliminar el hotel?`)) {

                fetch('/delete-hotel', { method: 'POST', 
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ id_hotel:numhotel })
                })
                .then(response => response.json())
                .then(data => {
                    console.log('dads', data);
                    if (data.estado) {
                        alert(data.mensaje);
                        boton.closest('tr').remove(); // Eliminar la fila del hotel de la tabla
                    } else {
                        alert(data.mensaje);
                    }
                })
                .catch(error => console.error('Error:', error));
            }
        });
    });
};

