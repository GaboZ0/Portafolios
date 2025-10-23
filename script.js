// ---------- Mostrar fecha actual en el footer ----------
function mostrarFechaActual() {
    const fecha = new Date();
    const opciones = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric'
    };
    const fechaFormateada = fecha.toLocaleDateString('es-ES', opciones);
    document.getElementById('fecha-footer').textContent = fechaFormateada;
}

mostrarFechaActual();

// ---------- Modo claro/oscuro ----------
const modoBtn = document.getElementById('modoBtn');
const body = document.body;

// Verificar preferencia guardada
if (localStorage.getItem('modoClaro') === 'true') {
    body.classList.add('modo-claro');
    modoBtn.textContent = 'Claro';
}

modoBtn.addEventListener('click', () => {
    body.classList.toggle('modo-claro');
    
    if (body.classList.contains('modo-claro')) {
        modoBtn.textContent = 'Claro';
        localStorage.setItem('modoClaro', 'true');
    } else {
        modoBtn.textContent = 'Oscuro';
        localStorage.setItem('modoClaro', 'false');
    }
});

// ---------- Botón "Volver arriba" ----------
const irArribaBtn = document.getElementById('irArriba');

// Mostrar u ocultar el botón según la posición del scroll
window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
        irArribaBtn.classList.add('mostrar');
    } else {
        irArribaBtn.classList.remove('mostrar');
    }
});

// Ir al inicio cuando se hace clic en el botón
irArribaBtn.addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ---------- Mostrar / Ocultar info extra de proyectos ----------
const botonesVerMas = document.querySelectorAll(".verMasBtn");

botonesVerMas.forEach(boton => {
    boton.addEventListener("click", () => {
        const targetId = boton.getAttribute("data-target");
        const infoExtra = document.getElementById(targetId);

        if (infoExtra.style.display === "block") {
            infoExtra.style.display = "none";
            boton.textContent = "Ver más";
        } else {
            infoExtra.style.display = "block";
            boton.textContent = "Ver menos";
        }
    });
});

// ---------- Validación de formulario ----------
const formulario = document.getElementById('formContacto');
const nombre = document.getElementById('nombre');
const email = document.getElementById('email');
const mensaje = document.getElementById('mensaje');
const contador = document.getElementById('contador');

// Contador de caracteres para el mensaje
mensaje.addEventListener('input', () => {
    const longitud = mensaje.value.length;
    contador.textContent = longitud;
    
    if (longitud > 1000) {
        contador.style.color = 'red';
    } else {
        contador.style.color = '#aaa';
    }
});

// Validación en tiempo real
nombre.addEventListener('blur', validarNombre);
email.addEventListener('blur', validarEmail);
mensaje.addEventListener('blur', validarMensaje);

function validarNombre() {
    const errorNombre = document.getElementById('errorNombre');
    
    if (nombre.value.trim() === '') {
        errorNombre.textContent = 'El nombre es obligatorio';
        return false;
    } else if (nombre.value.trim().length < 2) {
        errorNombre.textContent = 'El nombre debe tener al menos 2 caracteres';
        return false;
    } else {
        errorNombre.textContent = '';
        return true;
    }
}

function validarEmail() {
    const errorEmail = document.getElementById('errorEmail');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (email.value.trim() === '') {
        errorEmail.textContent = 'El email es obligatorio';
        return false;
    } else if (!emailRegex.test(email.value)) {
        errorEmail.textContent = 'Ingrese un email válido';
        return false;
    } else {
        errorEmail.textContent = '';
        return true;
    }
}

function validarMensaje() {
    const errorMensaje = document.getElementById('errorMensaje');
    
    if (mensaje.value.trim() === '') {
        errorMensaje.textContent = 'El mensaje es obligatorio';
        return false;
    } else if (mensaje.value.trim().length < 10) {
        errorMensaje.textContent = 'El mensaje debe tener al menos 10 caracteres';
        return false;
    } else {
        errorMensaje.textContent = '';
        return true;
    }
}

// Guardar datos en localStorage
function guardarDatosFormulario() {
    const datos = {
        nombre: nombre.value,
        email: email.value,
        mensaje: mensaje.value,
        fecha: new Date().toISOString()
    };
    
    try {
        localStorage.setItem('formularioContacto', JSON.stringify(datos));
        console.log('Datos guardados en localStorage:', datos);
    } catch (e) {
        console.error('Error al guardar en localStorage:', e);
    }
}

// Envío del formulario
formulario.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const nombreValido = validarNombre();
    const emailValido = validarEmail();
    const mensajeValido = validarMensaje();
    
    if (nombreValido && emailValido && mensajeValido) {
        // Guardar datos en localStorage
        guardarDatosFormulario();
        
        // Simular envío (en un caso real, aquí iría la llamada AJAX)
        alert('✅ ¡Mensaje enviado con éxito!');
        formulario.reset();
        contador.textContent = '0';
        localStorage.removeItem('formularioContacto');
    } else {
        alert('❌ Por favor, complete correctamente todos los campos');
    }
});


const apiKey = "62285a4a5163d20fd6c74c40d12e5b0f"; 

document.getElementById("btnClima").addEventListener("click", obtenerClima);

function obtenerClima() {
  const ciudad = document.getElementById("ciudad").value.trim();
  const resultado = document.getElementById("resultado-clima");

  if (ciudad === "") {
    resultado.innerHTML = "<p>⚠️ Por favor, ingresa una ciudad.</p>";
    return;
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${apiKey}&units=metric&lang=es`;

  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error("Ciudad no encontrada");
      return response.json();
    })
    .then(data => {
      const temp = data.main.temp;
      const descripcion = data.weather[0].description;
      const icono = data.weather[0].icon;

      resultado.innerHTML = `
        <h3>${data.name}</h3>
        <p>🌡 Temperatura: ${temp} °C</p>
        <p>📝 Descripción: ${descripcion}</p>
        <img src="https://openweathermap.org/img/wn/${icono}@2x.png" alt="icono del clima">
      `;
    })
    .catch(error => {
      resultado.innerHTML = `<p>❌ Error: ${error.message}</p>`;
    });
}