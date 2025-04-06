const express = require('express');
const router = express.Router();

// Import des routeurs individuels
const utilisateurRoutes = require('./utilisateur.routes');
// const demandePermisRoutes = require('./demandePermis.routes');
// const paiementRoutes = require('./paiement.routes');// Après les autres imports
const demandePermisRoutes = require('./demandePermis.routes');
const signal = require('./signalement.routes');
const infra = require('./infrastructure.routes');
const zone = require('./zoneUrbaine.routes');
const batiment = require('./batiment.routes');
const document = require('./document.routes');
const permis = require('./permis.routes');
const batimentDocumentRoutes = require('./batimentdocument.routes');
const paiementsRoutes = require('./paiment.routes');
const projetUrbainsRoutes = require('./projetUrbain.routes');

// Montage des routeurs
router.use('/projets', projetUrbainsRoutes);
router.use('/paiements', paiementsRoutes);
router.use('/utilisateurs', utilisateurRoutes);
router.use('/batiment-documents', batimentDocumentRoutes);
router.use('/signal', signal);
router.use('/permis', permis);
router.use('/documents', document);
router.use('/batiments', batiment);
router.use('/zone', zone);
router.use('/infrastructures', infra);
router.use('/demandes_permis', demandePermisRoutes);

// router.use('/demandes-permis', demandePermisRoutes);
// router.use('/paiements', paiementRoutes);
// ... autres montages

module.exports = router;