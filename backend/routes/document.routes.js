const express = require('express');
 const router = express.Router();
const DocumentController = require('../Controllers/document.controller');

// Route pour créer un document
router.post('/', DocumentController.create);

// Route pour obtenir tous les documents
router.get('/', DocumentController.getAll);

// Route pour obtenir un document par ID
router.get('/:id', DocumentController.getById);

// Route pour mettre à jour un document
router.put('/:id', DocumentController.update);

// Route pour supprimer un document
router.delete('/:id', DocumentController.delete);

module.exports = router;
