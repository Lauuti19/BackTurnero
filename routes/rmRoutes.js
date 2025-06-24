const express = require('express');
const router = express.Router();
const {
  createRM,
  getRMsByUser,
  updateRM
} = require('../controllers/rmController');

router.post('/', createRM);

router.get('/user/:id_usuario', getRMsByUser);

router.put('/update', updateRM);


module.exports = router;