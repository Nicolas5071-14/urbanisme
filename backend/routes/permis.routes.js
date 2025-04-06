const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const controller = require('../Controllers/permis.controller');

const validatePermis = [
  check('numeroPermis')
    .isLength({ min: 5 }).withMessage('Doit contenir au moins 5 caractères'),
  check('dateValidation').isISO8601(),
  check('dateExpiration').isISO8601(),
  check('demandePermis_id').optional().isInt()
];

router.post('/', validatePermis, controller.create);
router.get('/', controller.findAll);
router.get('/:id', controller.findOne);
router.put('/:id', validatePermis, controller.update);
router.delete('/:id', controller.delete);

// Route supplémentaire pour vérifier la validité
router.get('/:numero/valide', async (req, res) => {
  try {
    const permis = await Permis.findOne({
      where: { numeroPermis: req.params.numero }
    });
    
    const isValid = permis && new Date(permis.dateExpiration) > new Date();
    res.json({ valid: isValid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;