const sequelize = require('../config/database');

// Crear producto
const createProduct = async (req, res) => {
  const { nombre, descripcion, precio, stock } = req.body;
  if (!nombre || !precio) {
    return res.status(400).json({ error: 'Nombre y precio son obligatorios.' });
  }

  try {
    await sequelize.query(
      'CALL CreateProduct(:nombre, :descripcion, :precio, :stock)',
      { replacements: { nombre, descripcion, precio, stock: stock || 0 } }
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
    res.json({ productos });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

// Editar solo precio del producto
const updateProductPrice = async (req, res) => {
  const { id_producto, precio } = req.body;
  if (!id_producto || precio === undefined) {
    return res.status(400).json({ error: 'Faltan parámetros id_producto y precio.' });
  }

  try {
    await sequelize.query(
      'CALL UpdateProductPrice(:id_producto, :precio)',
      { replacements: { id_producto, precio } }
    );
    res.json({ message: 'Precio actualizado correctamente.' });
  } catch (error) {
    console.error('Error al actualizar precio:', error);
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
    await sequelize.query(
      'CALL DeleteProduct(:id_producto)',
      { replacements: { id_producto } }
    );
    res.json({ message: 'Producto eliminado correctamente.' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

module.exports = { createProduct, getProducts, updateProductPrice, deleteProduct };
