const PedidoModel = require('../models/PedidoModel');
const ArticuloModel = require('../models/ArticuloModel');

class PedidoController {
  async obtenerTodos(req, res) {
    try {
      const { clienteId, vendedorId } = req.query;
      
      let pedidos;
      if (clienteId) {
        // Filtrar por cliente
        pedidos = await PedidoModel.getByCliente(clienteId);
      } else if (vendedorId) {
        // Filtrar pedidos que contengan artículos del vendedor
        pedidos = await PedidoModel.getByVendedor(vendedorId);
      } else {
        // Retornar todos
        pedidos = await PedidoModel.getAll();
      }
      
      res.json({
        success: true,
        data: pedidos
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener pedidos',
        error: error.message
      });
    }
  }

  async obtenerPorId(req, res) {
    try {
      const { id } = req.params;
      const pedido = await PedidoModel.getById(id);
      
      if (!pedido) {
        return res.status(404).json({
          success: false,
          message: 'Pedido no encontrado'
        });
      }

      res.json({
        success: true,
        data: pedido
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener pedido',
        error: error.message
      });
    }
  }

  async crear(req, res) {
    try {
      console.log('🛒 Creando nuevo pedido...');
      const { cliente, articulos, clienteId } = req.body;
      console.log('   Cliente:', cliente);
      console.log('   Artículos a pedir:', articulos.length);

      // Validaciones
      if (!cliente || !cliente.nombre || !cliente.direccion || !cliente.telefono) {
        return res.status(400).json({
          success: false,
          message: 'Datos del cliente incompletos'
        });
      }

      if (!articulos || articulos.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Debe incluir al menos un artículo'
        });
      }

      // Verificar stock y calcular total
      let total = 0;
      const articulosDetalle = [];

      for (const item of articulos) {
        const articulo = await ArticuloModel.getById(item.articuloId);
        
        if (!articulo) {
          return res.status(404).json({
            success: false,
            message: `Artículo ${item.articuloId} no encontrado`
          });
        }

        if (articulo.stock < item.cantidad) {
          return res.status(400).json({
            success: false,
            message: `Stock insuficiente para ${articulo.nombre}. Disponible: ${articulo.stock}`
          });
        }

        articulosDetalle.push({
          articuloId: articulo.id,
          nombre: articulo.nombre,
          cantidad: item.cantidad,
          precio: articulo.precio,
          subtotal: articulo.precio * item.cantidad,
          vendedorId: articulo.vendedorId,
          vendedorNombre: articulo.vendedorNombre
        });

        total += articulo.precio * item.cantidad;
      }

      // Crear pedido
      const nuevoPedido = await PedidoModel.create({
        clienteId: clienteId || null,
        cliente,
        articulos: articulosDetalle,
        total
      });

      // Actualizar stock de los artículos
      console.log('📦 Actualizando stock de artículos...');
      for (const item of articulos) {
        await ArticuloModel.updateStock(item.articuloId, item.cantidad);
        console.log(`   ✅ Stock actualizado: ${item.articuloId}`);
      }

      console.log('✅ Pedido creado exitosamente:', nuevoPedido.id);
      console.log('💾 Datos guardados en pedidos.json');

      res.status(201).json({
        success: true,
        message: 'Pedido creado exitosamente',
        data: nuevoPedido
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al crear pedido',
        error: error.message
      });
    }
  }

  async actualizarEstado(req, res) {
    try {
      const { id } = req.params;
      const { estado } = req.body;

      const estadosValidos = ['pendiente', 'en_proceso', 'completado', 'cancelado'];
      if (!estadosValidos.includes(estado)) {
        return res.status(400).json({
          success: false,
          message: 'Estado inválido'
        });
      }

      const pedidoActualizado = await PedidoModel.updateEstado(id, estado);

      res.json({
        success: true,
        message: 'Estado actualizado exitosamente',
        data: pedidoActualizado
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
        error: error.message
      });
    }
  }

  async eliminar(req, res) {
    try {
      const { id } = req.params;
      await PedidoModel.delete(id);

      res.json({
        success: true,
        message: 'Pedido eliminado exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
        error: error.message
      });
    }
  }
}

module.exports = new PedidoController();

