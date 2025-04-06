const express = require('express');
const router = express.Router();
const paiementController = require('../Controllers/paiment.controller');

router.post('/', paiementController.create);
router.get('/', paiementController.findAll);
router.get('/:id', paiementController.findOne);
router.put('/:id', paiementController.update);
router.delete('/:id', paiementController.delete);

module.exports = router;
