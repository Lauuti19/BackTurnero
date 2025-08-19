const express = require('express');
const router = express.Router();
const { getActiveFees, registerFee, payFee } = require('../controllers/paymentsController');

router.get('/active-fees', getActiveFees);       
router.post('/register-fee', registerFee);      
router.post('/pay-fee', payFee);                

module.exports = router;
