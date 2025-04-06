const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const controller = require('../Controllers/demandePermis.controller');

// Validation middleware
const validateCreate = [
  check('typePermis').isIn(['CONSTRUCTION', 'COMMERCE', 'PUBLICITE']),
  check('utilisateur_id').isInt()
];

router.post('/', validateCreate, controller.create);
router.get('/', controller.findAll);
router.get('/statut/:statut', [
  check('statut').isIn(['BROUILLON', 'SOUMIS', 'VALIDE', 'REJETE'])
], controller.findByStatus);
router.put('/:id/documents', controller.updateDocuments);
router.put('/:id/geometrie', controller.updateGeometry);
router.delete('/:id', controller.delete);

module.exports = router;