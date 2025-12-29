const express = require('express');
const router = express.Router();

const {
  getActiveFees,
  registerFee,
  payFee,
  createMpPreference,
  mpWebhook,
} = require('../controllers/paymentsController');

const { authenticateToken } = require('../middlewares/authenticateToken');
const { authorizeRole } = require('../middlewares/authMiddleware');

router.get('/active-fees', authenticateToken, getActiveFees);

router.post('/register-fee', authenticateToken, authorizeRole(['admin','profesor']), registerFee);
router.post('/pay-fee', authenticateToken, authorizeRole(['admin','profesor']), payFee);

router.post('/mp/preference', authenticateToken, authorizeRole(['alumno']), createMpPreference);

router.post('/mp/webhook', mpWebhook);

module.exports = router;
