const fs = require('fs').promises;
const path = require('path');

class PedidoModel {
  constructor() {
    this.dataPath = path.join(__dirname, '../data/pedidos.json');
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
    const pedidos = await this.getAll();
    return pedidos.find(ped => ped.id === id);
  }

  async create(pedidoData) {
    const pedidos = await this.getAll();
    const nuevoPedido = {
      id: Date.now().toString(),
      clienteId: pedidoData.clienteId || null,
      cliente: {
        nombre: pedidoData.cliente.nombre,
        direccion: pedidoData.cliente.direccion,
        telefono: pedidoData.cliente.telefono
      },
      articulos: pedidoData.articulos, // Array de {articuloId, nombre, cantidad, precio, vendedorId}
      total: pedidoData.total,
      estado: 'pendiente',
      fechaPedido: new Date().toISOString()
    };

    pedidos.push(nuevoPedido);
    await this.save(pedidos);
    return nuevoPedido;
  }

  async getByCliente(clienteId) {
    const pedidos = await this.getAll();
    return pedidos.filter(ped => ped.clienteId === clienteId);
  }

  async getByVendedor(vendedorId) {
    const pedidos = await this.getAll();
    // Filtrar pedidos que contengan artículos de este vendedor
    return pedidos.filter(pedido => 
      pedido.articulos.some(art => art.vendedorId === vendedorId)
    );
  }

  async updateEstado(id, estado) {
    const pedidos = await this.getAll();
    const index = pedidos.findIndex(ped => ped.id === id);
    
    if (index === -1) {
      throw new Error('Pedido no encontrado');
    }

    pedidos[index].estado = estado;
    pedidos[index].fechaActualizacion = new Date().toISOString();

    await this.save(pedidos);
    return pedidos[index];
  }

  async delete(id) {
    const pedidos = await this.getAll();
    const filtered = pedidos.filter(ped => ped.id !== id);
    
    if (filtered.length === pedidos.length) {
      throw new Error('Pedido no encontrado');
    }

    await this.save(filtered);
    return true;
  }

  async save(pedidos) {
    const dirPath = path.dirname(this.dataPath);
    try {
      await fs.access(dirPath);
    } catch {
      await fs.mkdir(dirPath, { recursive: true });
    }
    await fs.writeFile(this.dataPath, JSON.stringify(pedidos, null, 2));
    console.log(`💾 Guardado: ${pedidos.length} pedidos en ${this.dataPath}`);
  }
}

module.exports = new PedidoModel();

