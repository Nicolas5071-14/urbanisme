const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const utilisateurController = require('../Controllers/utilisateur.controller');

// Validation middleware
const validateCreate = [
  check('email').isEmail(),
  check('motDePasse').isLength({ min: 6 })
];

router.post('/', validateCreate, utilisateurController.create);
router.get('/', utilisateurController.findAll);
router.get('/role/:role', utilisateurController.findByRole); // <-- Correction ici
router.get('/:id', utilisateurController.findOne);
router.put('/:id', validateCreate, utilisateurController.update);
router.delete('/:id', utilisateurController.delete);

module.exports = router;