const UsuarioModel = require('../models/UsuarioModel');

class AuthController {
  async registro(req, res) {
    try {
      const { nombre, email, password, rol } = req.body;

      // Validaciones
      if (!nombre || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Nombre, email y contraseña son obligatorios'
        });
      }

      if (!['cliente', 'vendedor'].includes(rol)) {
        return res.status(400).json({
          success: false,
          message: 'El rol debe ser "cliente" o "vendedor"'
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'La contraseña debe tener al menos 6 caracteres'
        });
      }

      const nuevoUsuario = await UsuarioModel.create({
        nombre,
        email: email.toLowerCase(),
        password,
        rol
      });

      res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente',
        data: nuevoUsuario
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
        error: error.message
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email y contraseña son obligatorios'
        });
      }

      const usuario = await UsuarioModel.verificarCredenciales(
        email.toLowerCase(),
        password
      );

      if (!usuario) {
        return res.status(401).json({
          success: false,
          message: 'Credenciales inválidas'
        });
      }

      res.json({
        success: true,
        message: 'Inicio de sesión exitoso',
        data: usuario
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al iniciar sesión',
        error: error.message
      });
    }
  }

  async obtenerPerfil(req, res) {
    try {
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'ID de usuario requerido'
        });
      }

      const usuario = await UsuarioModel.getById(userId);

      if (!usuario) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      const { password, ...usuarioSinPassword } = usuario;

      res.json({
        success: true,
        data: usuarioSinPassword
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener perfil',
        error: error.message
      });
    }
  }
}

module.exports = new AuthController();

