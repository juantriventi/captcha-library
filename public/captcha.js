let userInteracted = false; // Variable para rastrear la interacción del usuario
let captchaVerified = false; // Variable para verificar el estado del CAPTCHA

// Función para verificar el CAPTCHA al hacer clic en "No soy un robot"
function addCaptchaToForm(form, buttonColor, textColor, verifiedColor, hoverColor) {

    // Crear el botón de verificación
    const verifyButton = document.createElement('button');
    verifyButton.type = 'button'; // Este botón no enviará el formulario
    verifyButton.innerText = 'No soy un robot';

    // Aplicar estilos al botón
    verifyButton.style.backgroundColor = buttonColor; // Usar el color proporcionado
    verifyButton.style.color = textColor; // Usar el color de texto proporcionado
    verifyButton.style.border = 'none'; // Sin borde
    verifyButton.style.padding = '10px 20px'; // Espaciado interno
    verifyButton.style.marginBottom = '10px'; // Espaciado interno
    verifyButton.style.fontSize = '16px'; // Tamaño de la fuente
    verifyButton.style.cursor = 'pointer'; // Cambiar cursor al pasar el ratón
    verifyButton.style.borderRadius = '5px'; // Bordes redondeados
    verifyButton.style.transition = 'background-color 0.3s ease'; // Transición suave para el color de fondo

    // Añadir clase para la animación de vibración
    const shakeAnimation = `
        @keyframes shake {
            0% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            50% { transform: translateX(5px); }
            75% { transform: translateX(-5px); }
            100% { transform: translateX(0); }
        }
        .shake {
            animation: shake 0.5s ease;
        }
    `;

    // Insertar el estilo en el documento
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = shakeAnimation;
    document.head.appendChild(styleSheet);

    console.log("Shake animation styles added.");

    // Cambiar el color al pasar el ratón
    verifyButton.onmouseover = function() {
        if (!captchaVerified) { // Solo cambiar el color si no está verificado
            verifyButton.style.backgroundColor = hoverColor; // Usar el color de hover proporcionado
        }
    };
    verifyButton.onmouseout = function() {
        if (!captchaVerified) { // Solo volver al color original si no está verificado
            verifyButton.style.backgroundColor = buttonColor; // Volver al color original
        }
    };

    // Crear el botón de envío
    const submitButton = form.querySelector('button[type="submit"]'); // Obtiene el botón de envío existente
    console.log("Submit button exists.");

    // Monitorear movimiento del mouse
    document.addEventListener("mousemove", function() {
        userInteracted = true; // Cambiar a true si el usuario mueve el mouse
    });

    // Monitorear interacciones táctiles
    document.addEventListener("touchstart", function() {
        userInteracted = true; // Cambiar a true si el usuario toca la pantalla
    });

    // Al hacer clic en el botón "No soy un robot"
    verifyButton.onclick = function() {

        // Verificar si el usuario ha interactuado
        if (!userInteracted) {
            alert('Por favor interactúa con la página antes de verificar.');
            return;
        }

        // Cambiar el texto del botón después de la verificación
        verifyButton.innerText = '¡No eres un robot!';
        verifyButton.style.backgroundColor = verifiedColor; // Cambiar color para indicar éxito
        captchaVerified = true; // Marcar CAPTCHA como verificado

        // Cambiar el comportamiento de hover después de la verificación
        verifyButton.onmouseover = null; // Desactivar hover
        verifyButton.onmouseout = null; // Desactivar mouseout
    };

    // Insertar el botón "No soy un robot" justo antes del botón de envío
    form.insertBefore(verifyButton, submitButton);

    // Comportamiento de envío del formulario
    form.onsubmit = function(e) {
        if (!captchaVerified) {
            e.preventDefault(); // Prevenir el envío si no ha sido verificado

            // Añadir animación de vibración al botón CAPTCHA
            verifyButton.classList.add('shake');

            setTimeout(() => {
                verifyButton.classList.remove('shake'); // Remover la clase después de la animación
            }, 500);

            return; // Evitar que el formulario se envíe
        }

        console.log("Form submitted successfully.");
    };
}

// Esperar a que el DOM se cargue completamente
document.addEventListener("DOMContentLoaded", function() {
    const forms = document.querySelectorAll('form'); // Seleccionar todos los formularios en la página
    const buttonColor = document.querySelector('script[src="https://captcha-library.vercel.app/captcha.js"]').getAttribute('data-button-color') || '#4b90cd'; // Color por defecto
    const textColor = document.querySelector('script[src="https://captcha-library.vercel.app/captcha.js"]').getAttribute('data-text-color') || '#ffffff'; // Color de texto por defecto
    const verifiedColor = document.querySelector('script[src="https://captcha-library.vercel.app/captcha.js"]').getAttribute('data-verified-color') || '#ffffff'; // Color después de la verificación
    const hoverColor = document.querySelector('script[src="https://captcha-library.vercel.app/captcha.js"]').getAttribute('data-hover-color') || '#3a8cb1'; // Color de hover por defecto

    if (forms.length > 0) {
        forms.forEach((form) => {
            addCaptchaToForm(form, buttonColor, textColor, verifiedColor, hoverColor); // Llamar a la función para añadir el captcha
        });
    } else {
        console.error("No se encontró ningún formulario.");
    }
});
