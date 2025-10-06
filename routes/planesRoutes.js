const express = require('express');
const router = express.Router();
const { getPlanes, deletePlan, createPlan, updatePlan } = require('../controllers/planesController');
const { authenticateToken } = require('../middlewares/authenticateToken');
const { authorizeRole } = require('../middlewares/authMiddleware');

router.get('/', authenticateToken, getPlanes);

router.put('/delete', authenticateToken, authorizeRole(['admin','profesor']),deletePlan);

router.post('/create', authenticateToken,authorizeRole(['admin','profesor']),createPlan);

router.put('/update', authenticateToken,authorizeRole(['admin','profesor']),updatePlan);

module.exports = router;