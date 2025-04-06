const express = require('express');
const router = express.Router();
const controller = require('../Controllers/batimentdocument.controller');

// Créer une association
router.post('/', controller.createAssociation);

// Supprimer une association
router.delete('/:id', controller.deleteAssociation);

// Récupérer les documents d'un bâtiment
router.get('/batiments/:batiment_id', controller.getDocumentsForBatiment);

// Récupérer les bâtiments d'un document
router.get('/documents/:document_id', controller.getBatimentsForDocument);

module.exports = router;