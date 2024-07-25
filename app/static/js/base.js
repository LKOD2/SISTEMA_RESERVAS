// document.addEventListener('DOMContentLoaded', ()=>{
//     let listaItems = document.querySelectorAll('.menu-item.desplegable');


//     listaItems.forEach(listaItems =>{
//         listaItems.addEventListener('click', ()=> {
//             listaItems.classList.toggle('activo')
//         });
//     });
// });

// let listaItems = document.querySelectorAll('.menu-item.desplegable');

// let menuItem = document.querySelectorAll('.menu-item');
// menuItem.forEach(menuItem =>{
//     menuItem.addEventListener('click', ()=>{
//         menuItem.classList.toggle('activo');
//         listaItems.classList.toggle('activo')
//     })
// })

//-------------------------------- LOGOUT ---------------------------------------


document.addEventListener('DOMContentLoaded', ()=>{
    const botonLogout = document.getElementById('menu-user');
    botonLogout.addEventListener('change', ()=>{
    
        if (botonLogout.value == 'logout'){

        
            fetch('/logout')
            .then(respuesta => respuesta.json())
            .then(data => {
                if(data.estado){
                    alert(data.mensaje);
                    window.location.href = '/login'
                }else{
                    alert(data.mensaje);
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        }

    })

})


//-------------------------------- DEFINIR HOTEL AL INICIAR ---------------------------------------


document.addEventListener('DOMContentLoaded', () => {
    verificarYActualizarHotel();

    function verificarYActualizarHotel() {
        const hotelJSON = localStorage.getItem('hotel');

        if (hotelJSON) {
            const hotel = JSON.parse(hotelJSON);

            if (hotel && hotel.nombre) {
                updateHotelNameInTemplateBase(hotel.nombre);
            }
        }else{
            alert('Selecciona un hotel en "Configuracion/Hoteles" para comenzar a trabajar')
        }
    }

    function updateHotelNameInTemplateBase(hotelNombre) {
        const hotelNameElement = document.getElementById('nombre-hotel');
        if (hotelNameElement) {
            hotelNameElement.textContent = hotelNombre;
        }
    }
});




//-------------------------------- MENU ---------------------------------------

const itemInicio = document.getElementById('item-inicio');

const itemGestion = document.getElementById('item-gestion');
const itemRecepcion = document.getElementById('item-recepcion');
const itemSalida = document.getElementById('item-salida');

const itemReservas = document.getElementById('item-reservas');
const itemVentas = document.getElementById('item-ventas');
const itemProductos = document.getElementById('item-productos');
const itemHabitaciones = document.getElementById('item-habitaciones');
const itemPagos = document.getElementById('item-pagos');
const itemHuespedes = document.getElementById('item-huespedes');
const itemUsuarios = document.getElementById('item-usuarios');
const itemConfig = document.getElementById('item-config');
const itemHoteles = document.getElementById('item-hoteles');




document.addEventListener('DOMContentLoaded', ()=>{
    const itemInicio = document.getElementById('item-inicio');
    itemInicio.classList.add('activo');

});

itemInicio.addEventListener('click', ()=>{

    itemInicio.classList.add('activo');
    itemGestion.classList.remove('activo');
    itemVentas.classList.remove('activo');
    itemHabitaciones.classList.remove('activo');
    itemHuespedes.classList.remove('activo');
    itemUsuarios.classList.remove('activo');
    itemConfig.classList.remove('activo');

    document.getElementById('menu-item-ventas').classList.remove('activo');
    document.getElementById('menu-item-gestion').classList.remove('activo');
    document.getElementById('menu-item-config').classList.remove('activo');

});


itemGestion.addEventListener('click', function(){

    itemInicio.classList.remove('activo');
    itemGestion.classList.toggle('activo');
    itemVentas.classList.remove('activo');
    itemHabitaciones.classList.remove('activo');
    itemHuespedes.classList.remove('activo');
    itemUsuarios.classList.remove('activo');
    itemConfig.classList.remove('activo');

    document.getElementById('menu-item-gestion').classList.toggle('activo');
    document.getElementById('menu-item-ventas').classList.remove('activo');
    document.getElementById('menu-item-config').classList.remove('activo');

});

itemRecepcion.addEventListener('click', function(){

    itemInicio.classList.remove('activo');
    //itemGestion.classList.toggle('activo');
    itemRecepcion,this.classList.add('activo')
    itemVentas.classList.remove('activo');
    itemHabitaciones.classList.remove('activo');
    itemHuespedes.classList.remove('activo');
    itemUsuarios.classList.remove('activo');
    itemConfig.classList.remove('activo');

    //document.getElementById('menu-item-gestion').classList.toggle('activo');
    document.getElementById('menu-item-ventas').classList.remove('activo');

    cargarRecepcion()
});

itemSalida.addEventListener('click', function(){

    itemInicio.classList.remove('activo');
    //itemGestion.classList.toggle('activo');
    itemRecepcion,this.classList.remove('activo')
    itemSalida,this.classList.add('activo')
    itemVentas.classList.remove('activo');
    itemHabitaciones.classList.remove('activo');
    itemHuespedes.classList.remove('activo');
    itemUsuarios.classList.remove('activo');
    itemConfig.classList.remove('activo');

    //document.getElementById('menu-item-gestion').classList.toggle('activo');
    document.getElementById('menu-item-ventas').classList.remove('activo');

    cargarSalida();
});

itemReservas.addEventListener('click', function(){

    itemInicio.classList.remove('activo');
    itemGestion.classList.remove('activo');
    itemReservas.classList.add('activo');
    itemVentas.classList.remove('activo');
    itemHabitaciones.classList.remove('activo');
    itemHuespedes.classList.remove('activo');
    itemUsuarios.classList.remove('activo');
    itemConfig.classList.remove('activo');

    document.getElementById('menu-item-gestion').classList.remove('activo');
    document.getElementById('menu-item-ventas').classList.remove('activo');
    document.getElementById('menu-item-config').classList.remove('activo');

    cargarReservas();
});

itemVentas.addEventListener('click', function(){

    itemInicio.classList.remove('activo');
    itemGestion.classList.remove('activo');
    itemVentas.classList.add('activo');
    itemHabitaciones.classList.remove('activo');
    itemHuespedes.classList.remove('activo');
    itemUsuarios.classList.remove('activo');
    itemConfig.classList.remove('activo');

    document.getElementById('menu-item-ventas').classList.toggle('activo');
    document.getElementById('menu-item-gestion').classList.remove('activo');

});

itemProductos.addEventListener('click', function(){
    
    document.getElementById('menu-item-ventas').classList.remove('activo');
    document.getElementById('menu-item-gestion').classList.remove('activo');

    cargarProductos();
})
;
itemHabitaciones.addEventListener('click', function(){
    itemInicio.classList.remove('activo');
    itemGestion.classList.remove('activo');
    itemVentas.classList.remove('activo');
    itemHabitaciones.classList.add('activo');
    itemHuespedes.classList.remove('activo');
    itemUsuarios.classList.remove('activo');
    itemConfig.classList.remove('activo');

    document.getElementById('menu-item-ventas').classList.remove('activo');
    document.getElementById('menu-item-gestion').classList.remove('activo');
    document.getElementById('menu-item-config').classList.remove('activo');

    cargarHabitaciones();
});
itemHuespedes.addEventListener('click', function (){
    itemInicio.classList.remove('activo');
    itemGestion.classList.remove('activo');
    itemVentas.classList.remove('activo');
    itemHabitaciones.classList.remove('activo');
    itemHuespedes.classList.add('activo');
    itemUsuarios.classList.remove('activo');
    itemConfig.classList.remove('activo');

    document.getElementById('menu-item-ventas').classList.remove('activo');
    document.getElementById('menu-item-gestion').classList.remove('activo');
    document.getElementById('menu-item-config').classList.remove('activo');

    cargarHuespedes()
});
itemUsuarios.addEventListener('click', function (){
    itemInicio.classList.remove('activo');
    itemGestion.classList.remove('activo');
    itemVentas.classList.remove('activo');
    itemHabitaciones.classList.remove('activo');
    itemHuespedes.classList.remove('activo');
    itemUsuarios.classList.add('activo');
    itemConfig.classList.remove('activo');

    document.getElementById('menu-item-ventas').classList.remove('activo');
    document.getElementById('menu-item-gestion').classList.remove('activo');
    document.getElementById('menu-item-config').classList.remove('activo');

    cargarUsuarios()

});

itemConfig.addEventListener('click', function(){

    itemInicio.classList.remove('activo');
    itemGestion.classList.remove('activo');
    itemVentas.classList.remove('activo');
    itemHabitaciones.classList.remove('activo');
    itemHuespedes.classList.remove('activo');
    itemUsuarios.classList.remove('activo');
    itemConfig.classList.toggle('activo');


    document.getElementById('menu-item-ventas').classList.remove('activo');
    document.getElementById('menu-item-gestion').classList.remove('activo');
    document.getElementById('menu-item-config').classList.toggle('activo');


});

itemHoteles.addEventListener('click', function(){

    itemInicio.classList.remove('activo');
    itemGestion.classList.remove('activo');
    itemVentas.classList.toggle('activo');
    itemHabitaciones.classList.remove('activo');
    itemHuespedes.classList.remove('activo');
    itemUsuarios.classList.remove('activo');
    itemConfig.classList.add('activo');
    itemHoteles.classList.add('activo');

    document.getElementById('menu-item-ventas').classList.remove('activo');
    document.getElementById('menu-item-gestion').classList.remove('activo');

    cargarhoteles();

});

//------------------------ disponibles ----------------------


function cargarDisponibles() {
    fetch('/disponibles')
    .then(respuesta => respuesta.json())
    .then(habitaciones => {
        const contDisponibles = document.getElementById('cont-disponibles')

        habitacionesHTML = '';

        habitaciones.forEach(habitacion => {
            let habitacionHTML = `
                <div class="hab-disp" style="border: 2px solid ${getColor(habitacion.estado)};">
                        
                        <div class="cont-datos-disp">
                            <div class="numero" style="color: ${getColor(habitacion.estado)};">${habitacion.numero}</div>
                            <div class="tipo">Tipo: ${habitacion.tipo}</div>
                        </div>
                        <div class="icono" style="color: ${getColor(habitacion.estado)};">
                            <i class='bx bxs-bed'></i>
                        </div>
                       
                    
                        <div class="cont-flecha" style="background-color: ${getColor(habitacion.estado)};">
                            <i class='bx bxs-chevron-right'></i>
                        </div>
                    
                </div>
            `;
            habitacionesHTML += habitacionHTML;
        });

        contDisponibles.innerHTML = habitacionesHTML

    })
};

// Función para obtener el color según el estado
function getColor(estado) {
    switch(estado) {
        case 'disponible':
            return '#28B463';
        case 'ocupada':
            return '#E74C3C';
        case 'limpieza':
            return '#3498DB';
        default:
            return 'gray';
    }
}



//----------------------------- botones laterales--------------------

document.getElementById('boton-menu-cerrar').addEventListener('click', function() {
    document.querySelector('.gral').classList.toggle('menu-hidden');
});
document.getElementById('boton-menu-abrir').addEventListener('click', function() {
    document.querySelector('.gral').classList.toggle('menu-hidden');
});

document.getElementById('boton-dis-cerrar').addEventListener('click', function() {
    document.querySelector('.gral').classList.toggle('dis-hidden');
});
document.getElementById('boton-dis-abrir').addEventListener('click', function() {
    document.querySelector('.gral').classList.toggle('dis-hidden');
});



