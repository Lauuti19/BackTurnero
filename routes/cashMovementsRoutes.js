const express = require('express');
const router = express.Router();
const { 
  getAllCashMovements, 
  getCashMovementsByDateRange, 
  getTodayCashMovements,
  registerCashMovement

} = require('../controllers/cashMovementsController');

router.get('/all', getAllCashMovements);                   
router.get('/by-date-range', getCashMovementsByDateRange); 
router.get('/today', getTodayCashMovements);               
router.post('/register', registerCashMovement);            

module.exports = router;
