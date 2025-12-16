const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rutas de autenticación
router.post('/registro', authController.registro);
router.post('/login', authController.login);
router.get('/perfil', authController.obtenerPerfil);

module.exports = router;

