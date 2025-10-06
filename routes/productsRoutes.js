const express = require('express');
const router = express.Router();
const { createProduct, getProducts, updateProductPrice, deleteProduct } = require('../controllers/productsController');
const { authenticateToken } = require('../middlewares/authenticateToken');
const { authorizeRole } = require('../middlewares/authMiddleware');


router.post('/create', authenticateToken,authorizeRole(['admin','profesor']),createProduct);       
router.get('/list', authenticateToken, getProducts);           
router.put('/update-price', authenticateToken,authorizeRole(['admin','profesor']),updateProductPrice);   
router.delete('/delete/:id_producto', authenticateToken,authorizeRole(['admin','profesor']),deleteProduct); 

module.exports = router;
