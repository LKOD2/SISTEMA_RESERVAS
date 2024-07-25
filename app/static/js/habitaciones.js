// ---------------------- habitaciones ------------------------

function cargarHabitaciones() {
    fetch('/habitaciones')
    .then(respuesta => respuesta.text())
    .then(habitaciones => {
        const main = document.getElementById('main');
        main.innerHTML = habitaciones

        //----------------------------------------------------------------


        const modalCrearHabitacion = document.getElementById("cont-form-crear-habitacion");
        const modalEdithabitacion = document.getElementById('cont-form-edit-habitacion');
        const btnCrearHabitacion = document.getElementById('boton-crear-habitacion');


        let listaIconoCerrar = document.querySelectorAll('.icono-cerrar');
        listaIconoCerrar.forEach(icono =>{
            icono.addEventListener('click', ()=>{
                modalCrearHabitacion.classList.remove('activo');
                modalEdithabitacion.classList.remove('activo');
            })
        })

        btnCrearHabitacion.onclick = function() {
            modalCrearHabitacion.classList.add('activo');
            modalEdithabitacion.classList.remove('activo');
        }

        // Función para cerrar los modales al hacer clic fuera de su contenido

        window.onclick = function(event) {
            if (event.target === modalCrearHabitacion) {
                modalCrearHabitacion.classList.remove('activo');
            } else if (event.target === modalEdithabitacion) {
                modalEdithabitacion.classList.remove('activo');
            }
        }


        editarHabitacion();
        crearHabitacion();
        borrarHabitacion();

    });
};




//------------------------ CREAR habitacion ----------------------


function crearHabitacion() {
    let numeroValido = false;
    let precioValido = false;

    // Validar el número de habitación al quitar el foco
    document.getElementById('crear-numero-habitacion').addEventListener('blur', function() {
        const numero = this.value;
        const inputCrearNumero = document.getElementById('crear-numero-habitacion');
        const errorCrearNumero = document.getElementById('error-crear-numero-hab');
        numeroValido = validarNumeroHab(numero, inputCrearNumero, errorCrearNumero);
    });

    // Validar el precio de la habitación al quitar el foco
    document.getElementById('crear-precio-habitacion').addEventListener('blur', function() {
        const precio = this.value;
        const inputCrearPrecio = document.getElementById('crear-precio-habitacion');
        const errorCrearPrecio = document.getElementById('error-crear-precio-hab');
        precioValido = validarPrecioHab(precio, inputCrearPrecio, errorCrearPrecio);
    });

    // Validar los datos al enviar el formulario
    document.getElementById('crear-habitacion-form').addEventListener('submit', async function(event) {
        event.preventDefault();

        // Revalidar los inputs al intentar enviar el formulario
        const numeroInput = document.getElementById('crear-numero-habitacion');
        const precioInput = document.getElementById('crear-precio-habitacion');
        const errorCrearNumero = document.getElementById('error-crear-numero-hab');
        const errorCrearPrecio = document.getElementById('error-crear-precio-hab');

        const numero = numeroInput.value;
        const precio = precioInput.value;

        numeroValido = validarNumeroHab(numero, numeroInput, errorCrearNumero);
        precioValido = validarPrecioHab(precio, precioInput, errorCrearPrecio);

        // Obtener el ID del hotel desde localStorage
        const hotel = JSON.parse(localStorage.getItem('hotel'));
        const hotelId = hotel ? hotel.ID : null;

        if (!hotelId) {
            alert('El ID del hotel no está disponible. Por favor, selecciona un hotel.');
            return; // Detiene la ejecución si el ID del hotel no está disponible
        }

        if (numeroValido && precioValido) {
            var formData = new FormData(this);
            // Añadir el ID del hotel al FormData
            formData.append('hotel_id', hotelId);

            fetch('/insert-habitacion', { method: 'POST', body: formData })
            .then(respuesta => respuesta.json())
            .then(data => {
                if (data.estado) {
                    alert(data.mensaje);
                    console.log('estado:', data);
                    cargarHabitaciones();
                } else {
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


function validarNumeroHab(numero, input, label) {
    // Convierte el número a un entero
    const num = parseInt(numero, 10);
    
    // Sirve para validar que solo haya números
    const soloNumeros = /^\d+$/;

    if (!soloNumeros.test(numero)) {
        label.innerText = 'El número de habitación debe ser numerico';
        input.classList.add('error');
        return false;
    } else if (num < 1 || num > 500) {
        label.innerText = 'El número de habitación debe ser entre 1 y 500';
        input.classList.add('error');
        return false;
    } else {
        label.innerText = '';
        input.classList.remove('error');
        return true;
    }
};


function validarPrecioHab(precio, input, label) {
    // Convierte el número a un decimal
    const num = parseFloat(precio);

    // Sirve para validar que el número pueda tener decimales
    const soloNumeros = /^\d+(\.\d{1,2})?$/;
    console.log(num);

    if (!soloNumeros.test(precio)) {
        label.innerText = 'El precio no puede contener letras o símbolos';
        input.classList.add('error');
        return false;
    } else if (num < 1) {
        label.innerText = 'Ingresa un precio mayor a 1';
        input.classList.add('error');
        return false;
    } else {
        label.innerText = '';
        input.classList.remove('error');
        return true;
    }
}


//------------------------ EDITAR habitacion ----------------------


function editarHabitacion() {
    let precioValido = false;

    // Validar el precio de la habitación al quitar el foco
    document.getElementById('edit-precio-habitacion').addEventListener('blur', function() {
        const precio = this.value;
        const inputEditPrecio = document.getElementById('edit-precio-habitacion');
        const errorEditPrecio = document.getElementById('error-edit-precio-hab');
        precioValido = validarPrecioHab(precio, inputEditPrecio, errorEditPrecio);
    });

    // Configuración del evento click en los botones de edición
    document.querySelectorAll('.acciones.editar.hab').forEach(button => {
        button.addEventListener('click', function() {
            console.log('editar habitacion'); //editar habitacion

            // Obtiene los datos de la habitación de la fila correspondiente
            const id = button.getAttribute('data-habitacion');
            const fila = button.closest('tr');
            const numero = fila.querySelector('td:nth-child(1)').innerText;
            const tipo = fila.querySelector('td:nth-child(2)').innerText;
            const estado = fila.querySelector('td:nth-child(5)').innerText;
            const orientacion = fila.querySelector('td:nth-child(3)').innerText;
            const precio = fila.querySelector('td:nth-child(4)').innerText;

            // Llena el formulario de edición con los datos de la habitación
            document.getElementById('titulo-form-edit').innerText = `Editar habitación N° ${numero}`;
            document.getElementById('edit-numero-habitacion').value = numero;
            document.getElementById('edit-tipo-habitacion').value = tipo;
            document.getElementById('edit-estado-habitacion').value = estado;
            document.getElementById('edit-orientacion-habitacion').value = orientacion;
            document.getElementById('edit-precio-habitacion').value = precio;

            // Muestra el formulario de edición
            document.getElementById('cont-form-edit-habitacion').classList.toggle('activo');
        });
    });

    // Validar los datos al enviar el formulario
    document.getElementById('edit-habitacion-form').addEventListener('submit', function(event) {
        event.preventDefault();

        // Revalidar el precio al intentar enviar el formulario
        const precioInput = document.getElementById('edit-precio-habitacion');
        const errorEditPrecio = document.getElementById('error-edit-precio-hab');
        const precio = precioInput.value;

        precioValido = validarPrecioHab(precio, precioInput, errorEditPrecio);

        if (precioValido) {
            const formData = new FormData(this);

            fetch('/edit-habitacion', { method: 'POST', body: formData })
            .then(response => response.json())
            .then(data => {
                if (data.estado) {
                    alert(data.mensaje);
                    cargarHabitaciones();
                    document.getElementById('cont-form-edit-habitacion').classList.remove('activo');
                } else {
                    alert(data.mensaje);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });

        } else {
            alert('Por favor, corrige los errores antes de enviar el formulario');
        }
    });
}

//------------------------ BORRAR habitacion ----------------------


function borrarHabitacion(){
    document.querySelectorAll('.acciones.borrar.hab').forEach(boton => {
        boton.addEventListener('click', function() {

            console.log('borrar habitacion'); //borrar habitacion

            const numHabitacion = boton.getAttribute('data-habitacion');
            
            if (confirm(`¿Estás seguro de que quieres eliminar el habitacion?`)) {

                fetch('/delete-habitacion', { method: 'POST', 
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ numero:numHabitacion })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.estado) {
                        alert(data.mensaje);
                        boton.closest('tr').remove(); // Eliminar la fila del habitacion de la tabla
                    } else {
                        alert(data.mensaje);
                    }
                })
                .catch(error => console.error('Error:', error));
            }
        });
    });
};



//------------------------ recargar habitacion ----------------------



// function recargarHabitaciones() {

//     fetch('/habitaciones') // Realiza una solicitud GET al servidor
//     .then(response => response.json()) // Parsea la respuesta como JSON
//     .then(habitaciones => {
//         const habitacionesContainer = document.getElementById('habitaciones-container');
//         let habitacionesHTML = ''; // Inicializa una cadena vacía

//         // Itera sobre la lista de habitaciones y crea una cadena HTML para cada una
//         habitaciones.forEach(habitacion => {
//             let habitacionHTML = `
//                 <div class="habitacion" style="border: 2px solid ${getColor(habitacion.estado)};">
//                     <div class="cont-numero-tipo">
//                         <div>
//                             <div class="numero" style="color: ${getColor(habitacion.estado)};">${habitacion.numero}</div>
//                             <div class="tipo">Tipo: ${habitacion.tipo}</div>
//                         </div>
//                         <div class="icono" style="color: ${getColor(habitacion.estado)};">
//                             <i class='bx bxs-bed'></i>
//                         </div>
//                     </div>
                    
//                         <div class="estado" style="background-color: ${getColor(habitacion.estado)};">
//                             <p>${habitacion.estado}</p>
//                             <i class='bx bxs-chevron-right'></i>
//                         </div>
                    
//                 </div>
//             `;
//             habitacionesHTML += habitacionHTML; // Añade cada habitación a la cadena
//         });

//         habitacionesContainer.innerHTML = habitacionesHTML; // Asigna el HTML al contenedor
//     })
//     .catch(error => {
//         console.error('Error al cargar las habitaciones:', error);
//     });
// }

// // Función para obtener el color según el estado
// function getColor(estado) {
//     switch(estado) {
//         case 'disponible':
//             return '#28B463';
//         case 'ocupada':
//             return '#E74C3C';
//         case 'limpieza':
//             return '#3498DB';
//         default:
//             return 'gray';
//     }
// }





