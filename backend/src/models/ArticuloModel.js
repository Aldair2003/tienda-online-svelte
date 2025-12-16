const fs = require('fs').promises;
const path = require('path');

class ArticuloModel {
  constructor() {
    this.dataPath = path.join(__dirname, '../data/articulos.json');
  }

  async getAll() {
    try {
      const data = await fs.readFile(this.dataPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      // Si el archivo no existe, retornar array vacío
      if (error.code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }

  async getById(id) {
    const articulos = await this.getAll();
    return articulos.find(art => art.id === id);
  }

  async create(articuloData) {
    const articulos = await this.getAll();
    const nuevoArticulo = {
      id: Date.now().toString(),
      nombre: articuloData.nombre,
      descripcion: articuloData.descripcion,
      precio: articuloData.precio,
      stock: articuloData.stock,
      imagen: articuloData.imagen || '',
      vendedorId: articuloData.vendedorId || null,
      vendedorNombre: articuloData.vendedorNombre || '',
      fechaCreacion: new Date().toISOString()
    };
    
    articulos.push(nuevoArticulo);
    await this.save(articulos);
    return nuevoArticulo;
  }

  async getByVendedor(vendedorId) {
    const articulos = await this.getAll();
    return articulos.filter(art => art.vendedorId === vendedorId);
  }

  async update(id, articuloData) {
    const articulos = await this.getAll();
    const index = articulos.findIndex(art => art.id === id);
    
    if (index === -1) {
      throw new Error('Artículo no encontrado');
    }

    articulos[index] = {
      ...articulos[index],
      ...articuloData,
      id: articulos[index].id, // Mantener el ID original
      fechaActualizacion: new Date().toISOString()
    };

    await this.save(articulos);
    return articulos[index];
  }

  async delete(id) {
    const articulos = await this.getAll();
    const filtered = articulos.filter(art => art.id !== id);
    
    if (filtered.length === articulos.length) {
      throw new Error('Artículo no encontrado');
    }

    await this.save(filtered);
    return true;
  }

  async updateStock(id, cantidad) {
    const articulos = await this.getAll();
    const index = articulos.findIndex(art => art.id === id);
    
    if (index === -1) {
      throw new Error('Artículo no encontrado');
    }

    if (articulos[index].stock < cantidad) {
      throw new Error('Stock insuficiente');
    }

    articulos[index].stock -= cantidad;
    articulos[index].fechaActualizacion = new Date().toISOString();

    await this.save(articulos);
    return articulos[index];
  }

  async save(articulos) {
    const dirPath = path.dirname(this.dataPath);
    try {
      await fs.access(dirPath);
    } catch {
      await fs.mkdir(dirPath, { recursive: true });
    }
    await fs.writeFile(this.dataPath, JSON.stringify(articulos, null, 2));
    console.log(`💾 Guardado: ${articulos.length} artículos en ${this.dataPath}`);
  }
}

module.exports = new ArticuloModel();

