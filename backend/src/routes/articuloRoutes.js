const express = require('express');
const router = express.Router();
const articuloController = require('../controllers/articuloController');

// Rutas para artículos
router.get('/', articuloController.obtenerTodos);
router.get('/:id', articuloController.obtenerPorId);
router.post('/', articuloController.crear);
router.put('/:id', articuloController.actualizar);
router.delete('/:id', articuloController.eliminar);
router.patch('/:id/stock', articuloController.actualizarStock);

module.exports = router;

