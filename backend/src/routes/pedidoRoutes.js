const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');

// Rutas para pedidos
router.get('/', pedidoController.obtenerTodos);
router.get('/:id', pedidoController.obtenerPorId);
router.post('/', pedidoController.crear);
router.patch('/:id/estado', pedidoController.actualizarEstado);
router.delete('/:id', pedidoController.eliminar);

module.exports = router;

