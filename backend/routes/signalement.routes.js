// routes/signalement.routes.js
const express = require('express');
const router = express.Router();
const controller = require('../Controllers/signalement.controller');
const flexibleAuth = require('../middlewares/authMiddleware')({ strict: false });

router.post('/', flexibleAuth, controller.create);
router.get('/', controller.findAll);
router.get('/:id', controller.findOne);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);
router.get('/geosearch', controller.geoSearch);

module.exports = router;