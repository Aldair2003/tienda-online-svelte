const ArticuloModel = require('../models/ArticuloModel');

class ArticuloController {
  async obtenerTodos(req, res) {
    try {
      const { vendedorId } = req.query;
      
      let articulos;
      if (vendedorId) {
        // Si se especifica vendedorId, filtrar por vendedor
        articulos = await ArticuloModel.getByVendedor(vendedorId);
      } else {
        // Si no, retornar todos
        articulos = await ArticuloModel.getAll();
      }
      
      res.json({
        success: true,
        data: articulos
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener artículos',
        error: error.message
      });
    }
  }

  async obtenerPorId(req, res) {
    try {
      const { id } = req.params;
      const articulo = await ArticuloModel.getById(id);
      
      if (!articulo) {
        return res.status(404).json({
          success: false,
          message: 'Artículo no encontrado'
        });
      }

      res.json({
        success: true,
        data: articulo
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener artículo',
        error: error.message
      });
    }
  }

  async crear(req, res) {
    try {
      console.log('📝 Creando nuevo artículo...');
      const { nombre, descripcion, precio, stock, imagen, vendedorId, vendedorNombre } = req.body;
      console.log('   Nombre:', nombre);
      console.log('   Precio:', precio);
      console.log('   Stock:', stock);

      // Validaciones
      if (!nombre || !precio || stock === undefined) {
        return res.status(400).json({
          success: false,
          message: 'Nombre, precio y stock son obligatorios'
        });
      }

      if (precio < 0 || stock < 0) {
        return res.status(400).json({
          success: false,
          message: 'Precio y stock deben ser mayores o iguales a 0'
        });
      }

      const nuevoArticulo = await ArticuloModel.create({
        nombre,
        descripcion: descripcion || '',
        precio: parseFloat(precio),
        stock: parseInt(stock),
        imagen: imagen || '',
        vendedorId: vendedorId || null,
        vendedorNombre: vendedorNombre || ''
      });

      console.log('✅ Artículo creado exitosamente:', nuevoArticulo.id);
      console.log('💾 Datos guardados en articulos.json');

      res.status(201).json({
        success: true,
        message: 'Artículo creado exitosamente',
        data: nuevoArticulo
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al crear artículo',
        error: error.message
      });
    }
  }

  async actualizar(req, res) {
    try {
      const { id } = req.params;
      const { nombre, descripcion, precio, stock, imagen } = req.body;

      const datosActualizar = {};
      if (nombre !== undefined) datosActualizar.nombre = nombre;
      if (descripcion !== undefined) datosActualizar.descripcion = descripcion;
      if (precio !== undefined) datosActualizar.precio = parseFloat(precio);
      if (stock !== undefined) datosActualizar.stock = parseInt(stock);
      if (imagen !== undefined) datosActualizar.imagen = imagen;

      const articuloActualizado = await ArticuloModel.update(id, datosActualizar);

      res.json({
        success: true,
        message: 'Artículo actualizado exitosamente',
        data: articuloActualizado
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
      await ArticuloModel.delete(id);

      res.json({
        success: true,
        message: 'Artículo eliminado exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
        error: error.message
      });
    }
  }

  async actualizarStock(req, res) {
    try {
      const { id } = req.params;
      const { cantidad } = req.body;

      if (!cantidad || cantidad < 0) {
        return res.status(400).json({
          success: false,
          message: 'Cantidad inválida'
        });
      }

      const articuloActualizado = await ArticuloModel.updateStock(id, parseInt(cantidad));

      res.json({
        success: true,
        message: 'Stock actualizado exitosamente',
        data: articuloActualizado
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
        error: error.message
      });
    }
  }
}

module.exports = new ArticuloController();

