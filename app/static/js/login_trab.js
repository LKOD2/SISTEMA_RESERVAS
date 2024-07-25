
document.getElementById('form-login-trab').addEventListener('submit', async function(event) {
    event.preventDefault();

    var formData = new FormData(this);

    var usuario = formData.get('usuario');
    var clave = formData.get('clave');

    const usuarioValido = validarUsuario(usuario);
    const claveValida = validarClave(clave);


    if (usuarioValido && claveValida) {
        ingresar(formData);
    } else {
        alert('Los valores ingresados no son validos');
    }
});


function ingresar(datos) {
    fetch('/login', { method: 'POST', body: datos })
    .then(respuesta => {
        if (respuesta.redirected) {
            window.location.href = respuesta.url;
        } else {
            return respuesta.json();
        }
    })
    .then(datos => {
        if (datos && !datos.estado) {
            alert(datos.mensaje);
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}



function validarUsuario(usuario) {
    const entradaUsuario = document.getElementById('entrada-usuario');
    const errorUsuario = document.getElementById('error-usuario');

    if (usuario.length < 3) {
        errorUsuario.innerText = 'El nombre de usuario es muy corto';
        entradaUsuario.classList.add('error');
        return false;
    } else if (usuario.length > 15) {
        errorUsuario.innerText = 'El nombre de usuario es muy largo';
        entradaUsuario.classList.add('error');
        return false;
    } else {
        errorUsuario.innerText = '';
        entradaUsuario.classList.remove('error');
        return true;
    }
}

function validarClave(clave) {
    const passwordRegex = /^\d{4}$/;
    const entradaClave = document.getElementById('entrada-clave');
    const errorClave = document.getElementById('error-clave');

    if (!passwordRegex.test(clave)) {
        errorClave.innerText = 'La contraseña debe tener 4 dígitos';
        entradaClave.classList.add('error');
        return false;
    } else {
        errorClave.innerText = '';
        entradaClave.classList.remove('error');
        return true;
    }
}

document.getElementById('entrada-usuario').addEventListener('input', function() {
    validarUsuario(this.value);
});

document.getElementById('entrada-clave').addEventListener('input', function() {
    validarClave(this.value);
});

