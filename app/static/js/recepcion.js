
function cargarRecepcion(){
    fetch('/recepcion')
    .then(respuesta => respuesta.text()) 
    .then(datos => {
        const main = document.getElementById('main');
        main.innerHTML = datos;

        selectHabitacionRecepcion();

    }); 
};

function selectHabitacionRecepcion() {
    document.querySelectorAll('.habitacion').forEach(est => {
        est.addEventListener('click', () => {

            let idHab = est.getAttribute('ID-hab')
            let numero = est.querySelector('.numero').innerText;
            console.log('se clickeo la habitacion', numero);

            fetch('/form-recepcion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ID: idHab, numero: numero })
            })
            .then(respuesta => respuesta.text())
            .then(datos => {
                const main = document.getElementById('main');
                main.innerHTML = datos;

                cargarFecha();
                crearRecepcion();
                cargaInicial();

                expandirResp();
        
            })
            .catch(error => console.error('Error:', error));
        });
    });
}

function cargarFecha(){
    const fechaSalidaInput = document.getElementById('imput-fecha-salida');
    const fechaEntradaInput = document.getElementById('imput-fecha-entrada');
    
    let fechaActual = new Date().toISOString().split('T')[0];  // Obtener fecha actual en formato YYYY-MM-DD
    fechaEntradaInput.value = fechaActual;

    const today = new Date().toISOString().split('T')[0];
    fechaSalidaInput.setAttribute('min', fechaActual || today);
}


function cargaInicial(){
    const adelantoInput = document.getElementById('imput-adelanto');
    const totalPagoInput = document.getElementById('imput-total-pago');
    const precioHabitacion = parseFloat(totalPagoInput.value); // Precio por día de la habitación
    const botonSubmit = document.querySelector('.boton-submit');

    console.log('carga inicial');
    calcularDiasYTotal()   

    function calcularDiasYTotal() {

        const fechaSalidaInput = document.getElementById('imput-fecha-salida');
        const fechaEntradaInput = document.getElementById('imput-fecha-entrada');

        fechaSalidaInput.addEventListener('change', ()=>{ 
    
            const fechaEntrada = new Date(fechaEntradaInput.value);
            const fechaSalida = new Date(fechaSalidaInput.value);
    
            if (fechaSalida && fechaSalida > fechaEntrada) {
                const daysDiff = (fechaSalida - fechaEntrada) / (1000 * 60 * 60 * 24);
                const totalPago = daysDiff * precioHabitacion;
                totalPagoInput.value = totalPago;
    
                validarAdelanto(); // Asegura que el adelanto sea válido respecto al total
            } else {
                totalPagoInput.value = 0;
            }
        });
    }

    adelantoInput.addEventListener('input', validarAdelanto);

    function validarAdelanto() {
        const adelanto = parseFloat(adelantoInput.value);
        const totalPago = parseFloat(totalPagoInput.value);

        if (adelanto > totalPago) {
            alert('El adelanto no puede ser mayor que el total a pagar.');
            adelantoInput.value = 0;
        }
    }

    

    // Controlar envío del formulario
    botonSubmit.addEventListener('click', function(event) {
        const adelanto = parseFloat(adelantoInput.value);
        const totalPago = parseFloat(totalPagoInput.value);

        if (adelanto > totalPago) {
            alert('El adelanto no puede ser mayor que el total a pagar.');
            event.preventDefault(); // Evitar el envío del formulario
        }
    });
};
    

//-------------------------------------------------------------------------

function expandirResp() {
    // Obtén todos los radios relacionados con el responsable
    const responsableRadio = document.getElementById('responsable');
    const responsableH1 = document.getElementById('responsable-h1');
    const responsableH2 = document.getElementById('responsable-h2');
    const responsableH3 = document.getElementById('responsable-h3');

    // Obtén el formulario del responsable
    const formHuespedResp = document.getElementById('form-huesped-resp');

    // Añade un listener para el cambio en el estado del radio del responsable
    const handleResponsableChange = () => {
        const isResponsableChecked = responsableRadio.checked;
        
        if (isResponsableChecked) {
            // Activa los inputs del formulario del responsable
            formHuespedResp.querySelectorAll('input, select').forEach(element => {
                element.disabled = false;
            });
            formHuespedResp.classList.add('activo');
        } else {
            // Desactiva los inputs del formulario del responsable
            formHuespedResp.querySelectorAll('input, select').forEach(element => {
                element.disabled = true;
            });
            formHuespedResp.classList.remove('activo');
        }
    };

    // Añade listeners para los cambios en los radios del responsable
    const handleHuespedChange = () => {
        const isResponsableChecked = responsableRadio.checked;

        if (isResponsableChecked) {
            // Si el responsable está marcado, mantenemos los inputs activos
            formHuespedResp.querySelectorAll('input, select').forEach(element => {
                element.disabled = false;
            });
            formHuespedResp.classList.add('activo');
        } else {
            // Desactiva los inputs si uno de los radios de huesped está seleccionado
            formHuespedResp.querySelectorAll('input, select').forEach(element => {
                element.disabled = true;
            });
            formHuespedResp.classList.remove('activo');
        }
    };

    // Asigna los manejadores de eventos a los radios
    responsableRadio.addEventListener('change', handleResponsableChange);
    responsableH1.addEventListener('change', handleHuespedChange);
    responsableH2.addEventListener('change', handleHuespedChange);
    responsableH3.addEventListener('change', handleHuespedChange);
}

function expandirHuesped(formId) {
    const formHuesped1 = document.getElementById('form-huesped-1');
    const formHuesped2 = document.getElementById('form-huesped-2');
    const formHuesped3 = document.getElementById('form-huesped-3');
    const formHuespedResp = document.getElementById('form-huesped-resp');


    if(formId == 'form-huesped-1'){
        formHuesped1.classList.toggle("activo");
        formHuesped2.classList.remove('activo');
        formHuesped3.classList.remove('activo');
        formHuespedResp.classList.remove('activo');
    }else if(formId == 'form-huesped-2'){
        formHuesped1.classList.remove("activo");
        formHuesped2.classList.toggle('activo');
        formHuesped3.classList.remove('activo');
        formHuespedResp.classList.remove('activo');
    }else if (formId == 'form-huesped-3'){
        formHuesped1.classList.remove("activo");
        formHuesped2.classList.remove('activo');
        formHuesped3.classList.toggle('activo');
        formHuespedResp.classList.remove('activo');
    }
}


function crearRecepcion() {
    document.getElementById('form-recepcion').addEventListener('submit', function(event) {
        event.preventDefault();
        let data = {};

        // Recolectar datos de la habitación
        const idHabitacion = document.getElementById('rec-datos-habitacion').getAttribute('ID-hab');
        data.habitacion = { ID: idHabitacion };

        data.huespedes = [];

        // Recolectar datos del huésped responsable solo si está seleccionado
        const responsableChecked = document.getElementById('responsable') ? document.getElementById('responsable').checked : false;

        if (responsableChecked) {
            let huespedRes = {
                responsable: responsableChecked,
                nombre: document.getElementById('imput-nombre-huesped') ? document.getElementById('imput-nombre-huesped').value : '',
                apellido: document.getElementById('imput-apellido-huesped') ? document.getElementById('imput-apellido-huesped').value : '',
                email: document.getElementById('imput-email-huesped') ? document.getElementById('imput-email-huesped').value : '',
                telefono: document.getElementById('imput-telefono-huesped') ? document.getElementById('imput-telefono-huesped').value : '',
                pais: document.getElementById('imput-pais-huesped') ? document.getElementById('imput-pais-huesped').value : '',
                tipoDocumento: document.getElementById('imput-tipo-doc-huesped') ? document.getElementById('imput-tipo-doc-huesped').value : '',
                numDocumento: document.getElementById('imput-num-doc-huesped') ? document.getElementById('imput-num-doc-huesped').value : ''
            };
            data.huespedes.push(huespedRes);
        }

        // Recolectar datos de otros huéspedes
        for (let i = 1; i <= 3; i++) {
            if (document.getElementById(`form-huesped-${i}`)) {
                let huesped = {
                    responsable: document.getElementById(`responsable-h${i}`) ? document.getElementById(`responsable-h${i}`).checked : false,
                    nombre: document.getElementById(`imput-nombre-h${i}`) ? document.getElementById(`imput-nombre-h${i}`).value : '',
                    apellido: document.getElementById(`imput-apellido-h${i}`) ? document.getElementById(`imput-apellido-h${i}`).value : '',
                    email: document.getElementById(`imput-email-h${i}`) ? document.getElementById(`imput-email-h${i}`).value : '',
                    telefono: document.getElementById(`imput-telefono-h${i}`) ? document.getElementById(`imput-telefono-h${i}`).value : '',
                    pais: document.getElementById(`imput-pais-h${i}`) ? document.getElementById(`imput-pais-h${i}`).value : '',
                    tipoDocumento: document.getElementById(`imput-tipo-doc-h${i}`) ? document.getElementById(`imput-tipo-doc-h${i}`).value : '',
                    numDocumento: document.getElementById(`imput-num-doc-h${i}`) ? document.getElementById(`imput-num-doc-h${i}`).value : ''
                };
                data.huespedes.push(huesped);
            }
        }

        // Recolectar datos de la reserva
        data.reserva = {
            fechaEntrada: document.getElementById('imput-fecha-entrada').value,
            fechaSalida: document.getElementById('imput-fecha-salida').value,
            observacion: document.getElementById('imput-observacion').value
        };

        // Recolectar datos del pago
        const tipoPago = document.getElementById('imput-tipo-pago').value;
        const adelanto = document.getElementById('imput-adelanto').value;
        const precioInicial = document.getElementById('imput-total-pago').value;
        if (parseFloat(adelanto) === parseFloat(precioInicial)){
            var restante = 0
            var totalPago = precioInicial
            var estadoPago = 'pagado'
        }else{
            restante = precioInicial - adelanto
            estadoPago = 'pendiente'
            totalPago = 0
        }

        data.pago = {
            tipoPago: tipoPago,
            precioInicial: precioInicial,
            adelanto: adelanto,
            restante: restante,
            totalPago: totalPago,
            estadoPago: estadoPago
        };

        console.log(data);

        fetch('/reservar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            if (data.estado) {
                alert('Reserva registrada exitosamente.');
                cargarRecepcion();
            } else {
                alert('Ocurrió un error al registrar la reserva.');
            }
        })
        .catch(error => console.error('Error:', error));
    });
}





// function crearRecepcion(){

//     document.getElementById('form-recepcion').addEventListener('submit', function(event) {
//         event.preventDefault();
//         let data = {};

//         const idHabitacion = document.getElementById('rec-datos-habitacion').getAttribute('ID-hab')

//         data.habitacion = {ID: idHabitacion}

//         // Validar y recolectar datos del primer huesped
//         if (document.getElementById('form-huesped-resp')) {

//             if(document.getElementById('responsable').checked){
//                 data.huespedRes = {
//                     responsable: document.getElementById('responsable').checked,
//                     nombre: document.getElementById('imput-nombre-huesped').value,
//                     apellido: document.getElementById('imput-apellido-huesped').value,
//                     email: document.getElementById('imput-email-huesped').value,
//                     telefono: document.getElementById('imput-telefono-huesped').value,
//                     pais: document.getElementById('imput-pais-huesped').value,
//                     tipoDocumento: document.getElementById('imput-tipo-doc-huesped').value,
//                     numDocumento: document.getElementById('imput-num-doc-huesped').value
//                 };
//             }
//         }

//         // Validar y recolectar datos del segundo huesped si la habitacion es doble o triple
//         if (document.getElementById('form-huesped-1')) {
//             data.huesped1 = {
//                 nombre: document.getElementById('imput-nombre-h1').value,
//                 apellido: document.getElementById('imput-apellido-h1').value,
//                 email: document.getElementById('imput-email-h1').value,
//                 telefono: document.getElementById('imput-telefono-h1').value,
//                 pais: document.getElementById('imput-pais-h1').value,
//                 tipoDocumento: document.getElementById('imput-tipo-doc-h1').value,
//                 numDocumento: document.getElementById('imput-num-doc-h1').value
//             };
//         }

//         // Validar y recolectar datos del tercer huesped si la habitacion es triple
//         if (document.getElementById('form-huesped-2')) {
//             data.huesped2 = {
//                 nombre: document.getElementById('imput-nombre-h2').value,
//                 apellido: document.getElementById('imput-apellido-h2').value,
//                 email: document.getElementById('imput-email-h2').value,
//                 telefono: document.getElementById('imput-telefono-h2').value,
//                 pais: document.getElementById('imput-pais-h2').value,
//                 tipoDocumento: document.getElementById('imput-tipo-doc-h2').value,
//                 numDocumento: document.getElementById('imput-num-doc-h2').value
//             };
//         }
//         if (document.getElementById('form-huesped-3')) {
//             data.huesped3 = {
//                 nombre: document.getElementById('imput-nombre-h3').value,
//                 apellido: document.getElementById('imput-apellido-h3').value,
//                 email: document.getElementById('imput-email-h3').value,
//                 telefono: document.getElementById('imput-telefono-h3').value,
//                 pais: document.getElementById('imput-pais-h3').value,
//                 tipoDocumento: document.getElementById('imput-tipo-doc-h3').value,
//                 numDocumento: document.getElementById('imput-num-doc-h3').value
//             };
//         }

//         // Recolectar datos de la reserva
//         data.reserva = {
//             fechaEntrada: document.getElementById('imput-fecha-entrada').value,
//             fechaSalida: document.getElementById('imput-fecha-salida').value,
//             observacion: document.getElementById('imput-observacion').value
//         };


//         const tipoPago =  document.getElementById('imput-tipo-pago').value
//         const adelanto = document.getElementById('imput-adelanto').value
//         const totalPago = document.getElementById('imput-total-pago').value
//         var estadoPago = ''

//         if (parseFloat(adelanto) == parseFloat(totalPago)){
//             estadoPago = 'pagado'
//         }else{
//             estadoPago = 'pendiente'
//         }

//         data.pago = {
//             tipoPago: tipoPago,
//             adelanto: adelanto,
//             totalPago: totalPago,
//             estadoPago: estadoPago
//         };



//         console.log(data);

//         // // Enviar datos al servidor
//         // fetch('/reservar', {
//         //     method: 'POST',
//         //     headers: {
//         //         'Content-Type': 'application/json'
//         //     },
//         //     body: JSON.stringify(data)
//         // })
//         // .then(response => response.json())
//         // .then(data => {
//         //     if (data.estado) {
//         //         alert('Reserva registrada exitosamente.');
//         //     } else {
//         //         alert('Ocurrió un error al registrar la reserva.');
//         //     }
//         // })
//         // .catch(error => console.error('Error:', error));
//     });

// }



