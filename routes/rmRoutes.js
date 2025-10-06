const express = require('express');
const router = express.Router();
const {
  createRM,
  getRMsByUser,
  updateRM
} = require('../controllers/rmController');
const { authenticateToken } = require('../middlewares/authenticateToken');
const { authorizeRole } = require('../middlewares/authMiddleware');


router.post('/', authenticateToken,createRM);

router.get('/user/:id_usuario', authenticateToken,getRMsByUser);

router.put('/update', authenticateToken,updateRM);


module.exports = router;