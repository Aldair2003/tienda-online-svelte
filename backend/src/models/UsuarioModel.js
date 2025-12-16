const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

class UsuarioModel {
  constructor() {
    this.dataPath = path.join(__dirname, '../data/usuarios.json');
  }

  async getAll() {
    try {
      const data = await fs.readFile(this.dataPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }

  async getById(id) {
    const usuarios = await this.getAll();
    return usuarios.find(user => user.id === id);
  }

  async getByEmail(email) {
    const usuarios = await this.getAll();
    return usuarios.find(user => user.email === email);
  }

  hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
  }

  async create(usuarioData) {
    const usuarios = await this.getAll();
    
    // Verificar si el email ya existe
    const existente = await this.getByEmail(usuarioData.email);
    if (existente) {
      throw new Error('El correo electrónico ya está registrado');
    }

    const nuevoUsuario = {
      id: Date.now().toString(),
      nombre: usuarioData.nombre,
      email: usuarioData.email,
      password: this.hashPassword(usuarioData.password),
      rol: usuarioData.rol || 'cliente', // 'cliente' o 'vendedor'
      fechaRegistro: new Date().toISOString()
    };
    
    usuarios.push(nuevoUsuario);
    await this.save(usuarios);
    
    // Retornar sin el password
    const { password, ...usuarioSinPassword } = nuevoUsuario;
    return usuarioSinPassword;
  }

  async verificarCredenciales(email, password) {
    const usuario = await this.getByEmail(email);
    if (!usuario) {
      return null;
    }

    const passwordHash = this.hashPassword(password);
    if (usuario.password !== passwordHash) {
      return null;
    }

    // Retornar sin el password
    const { password: _, ...usuarioSinPassword } = usuario;
    return usuarioSinPassword;
  }

  async update(id, usuarioData) {
    const usuarios = await this.getAll();
    const index = usuarios.findIndex(user => user.id === id);
    
    if (index === -1) {
      throw new Error('Usuario no encontrado');
    }

    // Si se actualiza el password, hashearlo
    if (usuarioData.password) {
      usuarioData.password = this.hashPassword(usuarioData.password);
    }

    usuarios[index] = {
      ...usuarios[index],
      ...usuarioData,
      id: usuarios[index].id, // Mantener el ID original
      fechaActualizacion: new Date().toISOString()
    };

    await this.save(usuarios);
    
    const { password, ...usuarioSinPassword } = usuarios[index];
    return usuarioSinPassword;
  }

  async save(usuarios) {
    const dirPath = path.dirname(this.dataPath);
    try {
      await fs.access(dirPath);
    } catch {
      await fs.mkdir(dirPath, { recursive: true });
    }
    await fs.writeFile(this.dataPath, JSON.stringify(usuarios, null, 2));
  }
}

module.exports = new UsuarioModel();

