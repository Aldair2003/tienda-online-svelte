const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const corsOptions = require('./config/cors');

const articuloRoutes = require('./routes/articuloRoutes');
const pedidoRoutes = require('./routes/pedidoRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware de logging (después de bodyParser)
app.use((req, res, next) => {
  const timestamp = new Date().toLocaleString('es-ES');
  console.log(`\n📥 [${timestamp}] ${req.method} ${req.url}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('   Body:', JSON.stringify(req.body, null, 2));
  }
  if (req.query && Object.keys(req.query).length > 0) {
    console.log('   Query:', req.query);
  }
  next();
});

// Rutas
app.get('/', (req, res) => {
  res.json({
    message: 'API Tienda - Examen 2do Parcial',
    version: '2.0.0',
    endpoints: {
      auth: '/api/auth',
      articulos: '/api/articulos',
      pedidos: '/api/pedidos'
    }
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/articulos', articuloRoutes);
app.use('/api/pedidos', pedidoRoutes);

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: err.message
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📦 API disponible en http://localhost:${PORT}/api`);
});

module.exports = app;

