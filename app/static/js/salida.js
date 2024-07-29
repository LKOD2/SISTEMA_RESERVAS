function cargarSalida(){
    fetch('/salida')
    .then(response => response.text()) 
    .then(habitaciones => {
        const habitacionesContainer = document.getElementById('main');
        habitacionesContainer.innerHTML = habitaciones;

        selectHabitacionSalida();
    })
}


function selectHabitacionSalida() {
    document.querySelectorAll('.habitacion').forEach(est => {
        est.addEventListener('click', () => {
            let idHab = est.getAttribute('ID-hab')
            let numero = est.querySelector('.numero').innerText;
            let tipo = est.querySelector('.tipo').innerText;
            let estado = est.querySelector('.estado').innerText;
            console.log('se clickeo la habitacion', numero, tipo, estado);

            fetch('/form-salida', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ID: idHab, numero: numero, tipo: tipo })
            })
            .then(respuesta => respuesta.text())
            .then(datos => {
                const main = document.getElementById('main');
                main.innerHTML = datos;

                enviarSalida();
                calcularMontos();

            })
            .catch(error => console.error('Error:', error));
        });
    });
}





function enviarSalida() {
    const formularioSalida = document.getElementById('formulario-salida');
    formularioSalida.addEventListener('submit', async (event) => {
        event.preventDefault(); // Evitar el envío por defecto del formulario

        // Obtener los datos del formulario
        const formData = new FormData(formularioSalida);

        // Enviar los datos al servidor
        try {
            const response = await fetch('/salida', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                },
            });

            const result = await response.json();

            if (result.estado) {
                alert('Reserva finalizada con éxito');
                // Opcional: Redirigir o actualizar la página después del éxito
                cargarInicio(); // Cambia esta URL según sea necesario
            } else {
                alert(`Error: ${result.mensaje}`);
            }
        } catch (error) {
            console.error('Error al enviar los datos:', error);
            alert('Ocurrió un error al enviar los datos');
        }
    });
};


function calcularMontos() {
    
    const multaPagoInput = document.getElementById('multa-pago');
    multaPagoInput.addEventListener('input', ()=>{

        const restantePago = parseFloat(document.getElementById('restante-pago').value) || 0;
        const multaPago = parseFloat(document.getElementById('multa-pago').value) || 0;

        const totalPago = restantePago + multaPago;

        // Actualizar el campo total a pagar
        document.getElementById('total-pago').value = totalPago;
    });
}


