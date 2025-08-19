const express = require('express');
const router = express.Router();
const { createProduct, getProducts, updateProduct, deleteProduct } = require('../controllers/productsController');

router.post('/create', createProduct);       
router.get('/list', getProducts);           
router.put('/update', updateProduct);       
router.delete('/delete/:id_producto', deleteProduct); 

module.exports = router;
