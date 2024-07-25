//------------------------ cargar productos----------------------

function cargarProductos() {
    fetch('/productos')
    .then(respuesta => respuesta.text())
    .then(productos => {
        const contproductos = document.getElementById('main');
        contproductos.innerHTML = productos

        //----------------------------------------------------------------


        const modalCrearProductos = document.getElementById("cont-form-crear-producto");
        const modalEditProductos = document.getElementById('cont-form-edit-producto');
        const openModalBtn = document.getElementById('boton-crear-producto');


        let listaIconoCerrar = document.querySelectorAll('.icono-cerrar');
        listaIconoCerrar.forEach(icono =>{
            icono.addEventListener('click', ()=>{
                modalCrearProductos.classList.remove('activo');
                modalEditProductos.classList.remove('activo');
            })
        });

        openModalBtn.onclick = function() {
            modalCrearProductos.classList.add('activo');
            modalEditProductos.classList.remove('activo');
            tiempoReal()// esto agregue
        };

        // Función para cerrar los modales al hacer clic fuera de su contenido

        window.onclick = function(event) {
            if (event.target === modalCrearProductos) {
                modalCrearProductos.classList.remove('activo');
            } else if (event.target === modalEditProductos) {
                modalEditProductos.classList.remove('activo');
            }
        };


        editarProducto();
        //crearProducto(); //descomentar esto
        borrarProducto();

    });
};


function tiempoReal(){
    document.getElementById('imput-nombre-producto').addEventListener('input', function(){
        let valor = this.value
        console.log(valor);
        if(valor.length < 4){
            this.classList.add('error');
        }else{
            this.classList.remove('error');
        }
    })
}

//------------------------ CREAR PRODUCT ----------------------


// function crearProducto(){

//     document.getElementById('crear-producto-form').addEventListener('submit', async function(event){
//         event.preventDefault();

//         var formData = new FormData(this);


//         var nombre = formData.get('nombre');
//         var marca = formData.get('marca');
//         var detalle = formData.get('detalle');
//         var precio = formData.get('precio')
//         var cantidad = formData.get('cantidad');

//         validarDatos(nombre, marca, detalle, precio, cantidad, formData);



//     });

// };

// function insertarProducto(datos){

//     fetch('/insert-producto', { method: 'POST', body: datos })
//     .then(respuesta => respuesta.json())
//     .then(data => {

//         if(data.estado){
//             alert(data.mensaje);
//             console.log('estado:', data);
//             cargarProductos();
//         }else{
//             alert(data.mensaje);
//         }
//     })
//     .catch((error) => {
//         console.error('Error:', error);
//     });

// };



//------------------------ EDITAR productos ----------------------


function editarProducto(){
    document.querySelectorAll('.acciones.editar.producto').forEach(button => {
        button.addEventListener('click', function() {

            console.log('editar productos'); //editar productos

            // Obtiene los datos del productos de la fila correspondiente
            const id = button.getAttribute('data-producto');
            const fila = button.closest('tr');
            const nombre = fila.querySelector('td:nth-child(1)').innerText;
            const marca = fila.querySelector('td:nth-child(2)').innerText;
            const detalle = fila.querySelector('td:nth-child(3)').innerText;
            const precio = fila.querySelector('td:nth-child(4)').innerText;
            const cantidad = fila.querySelector('td:nth-child(5)').innerText;


            // Llena el formulario de edición con los datos del productos
            document.getElementById('edit-id-producto').value = id;
            document.getElementById('edit-nombre-producto').value = nombre;
            document.getElementById('edit-marca-producto').value = marca;
            document.getElementById('edit-detalle-producto').value = detalle;
            document.getElementById('edit-precio-producto').value = precio;
            document.getElementById('edit-cantidad-producto').value = cantidad;

            // Muestra el formulario de edición
            document.getElementById('cont-form-edit-producto').classList.toggle('activo');
        });
    });

    // Maneja el envío del formulario de edición
    document.getElementById('edit-producto-form').addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(this);
        fetch('/edit-producto', { method: 'POST', body: formData})
        .then(response => response.json())
        .then(data => {
            if (data.estado) {
                alert(data.mensaje);
                cargarProductos()
                document.getElementById('cont-form-edit-producto').classList.remove('activo');
            } else {
                alert(data.mensaje);
            }
        });
    });

};

//------------------------ BORRAR productos ----------------------


function borrarProducto(){
    document.querySelectorAll('.acciones.borrar.producto').forEach(boton => {
        boton.addEventListener('click', function() {

            console.log('borrar productos'); //borrar productos

            const idProductos = boton.getAttribute('data-producto');
            
            if (confirm(`¿Estás seguro de que quieres eliminar el productos?`)) {

                fetch('/delete-producto', { method: 'POST', 
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ id:idProductos })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.estado) {
                        alert(data.mensaje);
                        boton.closest('tr').remove(); // Eliminar la fila del productos de la tabla
                    } else {
                        alert(data.mensaje);
                    }
                })
                .catch(error => console.error('Error:', error));
            }
        });
    });
};



// //------------------------ VALIDAR productos ----------------------


// function validarDatos(nombre, marca, detalle, precio, cantidad, formData) {
//     console.log(nombre, marca, detalle, precio, cantidad, formData);

//     const regex = /[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/;
//     const numeroRegex = /^\d+(\.\d{1,2})?$/;
//     const cantidadRegex = /^\d{1,4}$/;  
//     const Regex = /^\d{1,10}$/; 

//     fetch(`/validar-producto/${nombre}`, { method: 'POST' })
//         .then(respuesta => respuesta.json())
//         .then(respuesta => {
//             console.log(respuesta);

//             let errores = [];

//             if (respuesta.estado === true) {
//                 errores.push(respuesta.mensaje);
//             } else {
//                 if (nombre.length < 4) {
//                     errores.push('El nombre es muy corto');
//                     document.getElementById('imput-nombre-producto').classList.add('error');
//                 } else if (nombre.length > 15) {
//                     errores.push('El nombre es muy largo');
//                     document.getElementById('imput-nombre-producto').classList.add('error');
//                 } else if (regex.test(nombre)) {
//                     errores.push('El nombre no puede contener símbolos o números');
//                     document.getElementById('imput-nombre-producto').classList.add('error');
//                 } else {
//                     document.getElementById('imput-nombre-producto').classList.remove('error');
//                 }

//                 if (marca.length < 4) {
//                     errores.push('La marca es muy corta');
//                     document.getElementById('imput-marca-producto').classList.add('error');
//                 } else if (marca.length > 15) {
//                     errores.push('La marca es muy larga');
//                     document.getElementById('imput-marca-producto').classList.add('error');
//                 } else if (regex.test(marca)) {
//                     errores.push('La marca no puede contener símbolos o números');
//                     document.getElementById('imput-marca-producto').classList.add('error');
//                 } else {
//                     document.getElementById('imput-marca-producto').classList.remove('error');
//                 }

//                 if (precio && !numeroRegex.test(precio)) {
//                     errores.push('El precio no puede contener símbolos o letras');
//                     document.getElementById('imput-precio-producto').classList.add('error');
                
//                 } else if (precio < 0) {
//                     errores.push('El precio no puede ser menor a 0');
//                     document.getElementById('imput-precio-producto').classList.add('error');
                    
//                 } else {
//                     document.getElementById('imput-precio-producto').classList.remove('error');
//                 }

//                 if (cantidad && !numeroRegex.test(cantidad)) {
//                     errores.push('La cantidad no puede contener símbolos o letras');
//                     document.getElementById('imput-cantidad-producto').classList.add('error');
//                 } else if (cantidad < 0) {
//                     errores.push('La cantidad no puede ser menor a 0');
//                     document.getElementById('imput-cantidad-producto').classList.add('error');
                
//                 } else {
//                     document.getElementById('imput-cantidad-producto').classList.remove('error');
//                 }

//                 if (errores.length > 0) {
//                     alert(errores.join('\n'));
//                 } else {
//                     insertarProducto(formData);
//                 }
//             }
//         })
//         .catch(error => {
//             console.error('Error:', error);
//             alert('Ocurrió un error al verificar el producto');
//         });
// }



//------------------------ VALIDAR productos ----------------------


// var validarDatos = (nombre, marca, detalle, precio, cantidad, formData, name) => {

//     console.log('entro');
    


//     const regex = /[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/;
//     const numeroRegex = /^\d+(\.\d{1,2})?$/;
//     const cantidadRegex = /^\d{1,4}$/;  
//     const Regex = /^\d{1,10}$/; 

//     fetch(`/validar-producto/${nombre}`, { method: 'POST' })
//         .then(respuesta => respuesta.json())
//         .then(respuesta => {
//             console.log('la base responde', respuesta);

//             let lerror = []

//             let errores = [];

//             if (respuesta.estado === true) {
//                 errores.push(respuesta.mensaje);
//             } else {
//                 if (nombre.length < 4) {
//                     errores.push('El nombre es muy corto');
//                     lerror.push('nombre')
//                 } else if (nombre.length > 15) {
//                     errores.push('El nombre es muy largo');
//                     lerror.push('nombre')
//                 } else if (regex.test(nombre)) {
//                     errores.push('El nombre no puede contener símbolos o números');
//                     lerror.push('nombre')
//                 } else {
//                     lerror.pop('nombre')
//                 }

//                 if (marca.length < 4) {
//                     errores.push('La marca es muy corta');
//                     lerror.push('marca')
//                 } else if (marca.length > 15) {
//                     errores.push('La marca es muy larga');
//                     lerror.push('marca')
//                 } else if (regex.test(marca)) {
//                     errores.push('La marca no puede contener símbolos o números');
//                     lerror.push('marca')
//                 } else {
//                     lerror.push('marca')
//                 }

//                 if (precio && !numeroRegex.test(precio)) {
//                     errores.push('El precio no puede contener símbolos o letras');
//                     lerror.push('precio')
                
//                 } else if (precio < 0) {
//                     errores.push('El precio no puede ser menor a 0');
//                     lerror.push('precio')
//                 } else {
//                     lerror.push('precio')
//                 }

//                 if (cantidad && !numeroRegex.test(cantidad)) {
//                     errores.push('La cantidad no puede contener símbolos o letras');
//                     lerror.push('cantidad')
//                 } else if (cantidad < 0) {
//                     errores.push('La cantidad no puede ser menor a 0');
//                     lerror.push('cantidad')
//                 } else {
//                     lerror.push('cantidad')
//                 }

//                 if (errores.length > 0) {
//                     alert(errores.join('\n'));
//                     lerror.forEach(lala =>{
//                         console.log(name, lala);
//                         document.getElementById(`${name}-${lala}-producto`).classList.add('error');

//                     })
//                     return false


//                 } else {
//                     lerror.forEach(lerror =>{
//                         console.log('else', lerror);

//                         document.getElementById(`${name}-${lerror}-producto`).classList.remove('error');

//                     });
//                     return true
//                 }
//             }
//         })
//         .catch(error => {
//             console.error('Error:', error);
//             alert('Ocurrió un error al verificar el producto');
//         });



// }



// //------------------------ CREAR PRODUCT ----------------------


// function crearProducto(){

//     document.getElementById('crear-producto-form').addEventListener('submit', async function(event){
//         event.preventDefault();

//         var formData = new FormData(this);


//         var nombre = formData.get('nombre');
//         var marca = formData.get('marca');
//         var detalle = formData.get('detalle');
//         var precio = formData.get('precio')
//         var cantidad = formData.get('cantidad');

//         console.log(nombre, marca, detalle, precio, cantidad);


//         // var imput = document.querySelectorAll('.imput')
//         // imput.forEach(imput =>{
//         //     console.log(nombre, marca, detalle, precio, cantidad);

//         //     nose = validarDatos(nombre, marca, detalle, precio, cantidad, formData, imput);
//         //     if (nose === true){
//         //         insertarProducto(formData)
//         //     }
//         // })

//         var name = 'imput'
//         isvalid = validarDatos(nombre, marca, detalle, precio, cantidad, formData, name);
//         console.log('devolvio', isvalid);

//     });

// };

// function insertarProducto(datos){

//     fetch('/insert-producto', { method: 'POST', body: datos })
//     .then(respuesta => respuesta.json())
//     .then(data => {

//         if(data.estado){
//             alert(data.mensaje);
//             console.log('estado:', data);
//             cargarProductos();
//         }else{
//             alert(data.mensaje);
//         }
//     })
//     .catch((error) => {
//         console.error('Error:', error);
//     });

// };


