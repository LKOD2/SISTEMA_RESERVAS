
document.addEventListener('DOMContentLoaded', ()=>{
    fetch('/inicio')
    .then(respuesta => respuesta.text())
    .then(datos => {
        const contUsuarios = document.getElementById('main');
        contUsuarios.innerHTML = datos;

        selectMenuInicio()
    });


});

function cargarInicio(){
    fetch('/inicio')
    .then(respuesta => respuesta.text())
    .then(datos => {
        const contUsuarios = document.getElementById('main');
        contUsuarios.innerHTML = datos;

        selectMenuInicio()
    });
}

document.getElementById('item-inicio').addEventListener('click', ()=>{

    fetch('/inicio')
    .then(respuesta => respuesta.text())
    .then(datos => {
        const contUsuarios = document.getElementById('main');
        contUsuarios.innerHTML = datos;

        selectMenuInicio()
    });

    
});

function selectMenuInicio(){
    document.querySelectorAll('.habitacion').forEach(est =>{
        est.addEventListener('click', ()=>{

            let estado = est.querySelector('.estado').innerText
            console.log(estado);
            if(estado == 'disponible'){
                fetch('/get-disponibles')
                .then(respuesta => respuesta.json())
                .then(datos => {
                    cargarHabitacionesInicio(datos)
                });
            }else if(estado == 'ocupada'){
                fetch('/get-ocupadas')
                .then(respuesta => respuesta.json())
                .then(datos => {
                    cargarHabitacionesInicio(datos)
                });
            }else if(estado == 'limpieza'){
                fetch('/get-limpieza')
                .then(respuesta => respuesta.json())
                .then(datos => {
                    cargarHabitacionesInicio(datos)
                });
            }else if(estado == 'todas'){
                fetch('/get-todas')
                .then(respuesta => respuesta.json())
                .then(datos => {
                    cargarHabitacionesInicio(datos)
                });
            }
        })
        
    });
}




function cargarHabitacionesInicio(habitaciones) {

    const habitacionesContainer = document.getElementById('habitaciones-container');
    let habitacionesHTML = ''; // Inicializa una cadena vacía

    habitaciones.forEach(habitacion => {
        let habitacionHTML = `
            <div class="habitacion ${habitacion.estado}">
                <div class="cont-numero-tipo">
                    <div>
                        <div class="numero" >${habitacion.numero}</div>
                        <div class="tipo">${habitacion.tipo}</div>
                    </div>
                    <div class="icono">
                        <i class='bx bxs-bed'></i>
                    </div>
                </div>
                
                    <div class="estado">
                        <p>${habitacion.estado}</p>
                        <i class='bx bxs-chevron-right'></i>
                    </div>
                
            </div>
        `;
        habitacionesHTML += habitacionHTML; // Añade cada habitación a la cadena
    });

    habitacionesContainer.innerHTML = habitacionesHTML; // Asigna el HTML al contenedor

}
