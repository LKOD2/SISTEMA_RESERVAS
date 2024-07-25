function cargarReservas() {
    fetch('/reservas')
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
