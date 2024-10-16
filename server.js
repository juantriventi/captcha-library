// server.js

const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const port = 3000;

// Middleware para parsear JSON
app.use(express.json());

// Middleware para sesiones
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
}));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public'))); // Asegúrate de que captcha.js esté en la carpeta 'public'

// Ruta para verificar el CAPTCHA (puedes implementar la lógica de verificación si es necesario)
app.post('/verify-captcha', (req, res) => {
    const { userCaptcha } = req.body;
    const storedCaptcha = req.session.captcha; // Captcha generado y almacenado en la sesión

    if (!storedCaptcha) {
        return res.json({ success: false, message: 'CAPTCHA no encontrado en la sesión.' });
    }

    if (userCaptcha.trim() === storedCaptcha) {
        return res.json({ success: true });
    } else {
        return res.json({ success: false, message: 'CAPTCHA incorrecto.' });
    }
});

// Generar y almacenar el CAPTCHA en la sesión (Ejemplo de generación de CAPTCHA)
app.get('/generate-captcha', (req, res) => {
    // Aquí debes generar el CAPTCHA y almacenarlo en req.session.captcha
    const captcha = generateCaptcha(); // Supón que tienes una función que genera un CAPTCHA
    req.session.captcha = captcha;
    res.json({ captcha }); // Enviar el CAPTCHA al cliente si es necesario
});

// Escuchar en el puerto
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});

// Función para generar un CAPTCHA (ejemplo básico)
function generateCaptcha() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let captcha = '';
    for (let i = 0; i < 4; i++) {
        captcha += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return captcha;
}
