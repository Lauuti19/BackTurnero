const express = require('express');
const router = express.Router();
const { getPlanes, deletePlan, createPlan, updatePlan } = require('../controllers/planesController');

router.get('/', getPlanes);

router.put('/delete', deletePlan);

router.post('/create', createPlan);

router.put('/update', updatePlan);

module.exports = router;