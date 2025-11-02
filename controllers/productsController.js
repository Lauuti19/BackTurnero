const sequelize = require('../config/database');

// Crear producto
const createProduct = async (req, res) => {
  const { nombre, descripcion, precio, costo, stock } = req.body;

  if (!nombre || precio === undefined) {
    return res.status(400).json({ error: 'Nombre y precio son obligatorios.' });
  }

  try {
    await sequelize.query(
      // ahora son 5 params
      'CALL CreateProduct(:nombre, :descripcion, :precio, :costo, :stock)',
      {
        replacements: {
          nombre,
          descripcion: descripcion || null,
          precio,
          costo: costo !== undefined ? costo : null,
          stock: stock || 0,
        },
      }
    );
    res.json({ message: 'Producto creado correctamente.' });
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

// Obtener productos
const getProducts = async (req, res) => {
  try {
    const productos = await sequelize.query('CALL GetProducts()');
    // ojo: mysql con CALL suele devolver [rows, meta], según cómo lo uses
    res.json({ productos });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

// Editar precio y/o costo del producto
const updateProductPrice = async (req, res) => {
  const { id_producto, precio, costo } = req.body;

  if (!id_producto) {
    return res.status(400).json({ error: 'Falta el id_producto.' });
  }

  if (precio === undefined && costo === undefined) {
    return res.status(400).json({ error: 'Enviá al menos precio o costo.' });
  }

  try {
    await sequelize.query(
      'CALL UpdateProductPrice(:id_producto, :precio, :costo)',
      {
        replacements: {
          id_producto,
          // si no viene, lo mandamos null para que el SP haga COALESCE
          precio: precio !== undefined ? precio : null,
          costo: costo !== undefined ? costo : null,
        },
      }
    );
    res.json({ message: 'Producto actualizado correctamente.' });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

// Eliminar producto
const deleteProduct = async (req, res) => {
  const { id_producto } = req.params;
  if (!id_producto) {
    return res.status(400).json({ error: 'Falta el id_producto.' });
  }

  try {
    await sequelize.query('CALL DeleteProduct(:id_producto)', {
      replacements: { id_producto },
    });
    res.json({ message: 'Producto eliminado correctamente.' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

module.exports = {
  createProduct,
  getProducts,
  updateProductPrice,
  deleteProduct,
};
