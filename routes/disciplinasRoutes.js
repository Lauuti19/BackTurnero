const express = require('express');
const router = express.Router();
const {getDisciplinas, deleteDiscipline, createDiscipline} = require('../controllers/disciplinasController.js');

router.get('/', getDisciplinas);
router.put('/delete', deleteDiscipline);
router.post('/create', createDiscipline);



module.exports = router;