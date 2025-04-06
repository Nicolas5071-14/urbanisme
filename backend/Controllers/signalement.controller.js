// controllers/signalement.controller.js
const { Signalement, Utilisateur } = require('../models');
const { Op } = require('sequelize');
const formatGeolocation = (loc) => 
    Array.isArray(loc) ? { type: 'Point', coordinates: loc } : loc;
  
  const sendSuccessResponse = (res, signalement) => 
    res.status(201).json({
      id: signalement.id,
      statut: signalement.statut,
      type: signalement.type,
      utilisateur_id: signalement.utilisateur_id // Retourne l'ID pour confirmation
    });
  
  const isAllowedToBypassAuth = (req) => 
    req.get('X-API-KEY') === process.env.INTERNAL_API_KEY;
  
  const handleCreationError = (res, error) => {
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({
        error: "Utilisateur inexistant",
        details: "L'utilisateur_id fourni ne correspond à aucun utilisateur valide"
      });
    }
    res.status(400).json({ 
      error: 'Erreur de création',
      details: error.message 
    });
  };

module.exports = {
  /**
   * Créer un signalement
   * POST /signalements
   */
  async create(req, res) {
    try {
      const { localisation, utilisateur_id, ...data } = req.body;
  
      // Cas 1 : Authentification via JWT (prioritaire)
      if (req.user?.id) {
        const geom = formatGeolocation(localisation);
        const signalement = await Signalement.create({
          ...data,
          localisation: geom,
          utilisateur_id: req.user.id // Priorité au user authentifié
        });
        return sendSuccessResponse(res, signalement);
      }
  
      // Cas 2 : Fallback pour intégrations externes (avec validation)
      if (utilisateur_id) {
        if (!isAllowedToBypassAuth(req)) {
          return res.status(403).json({ 
            error: "Accès refusé : droits insuffisants" 
          });
        }
  
        const geom = formatGeolocation(localisation);
        const signalement = await Signalement.create({
          ...data,
          localisation: geom,
          utilisateur_id
        });
        return sendSuccessResponse(res, signalement);
      }
  
      // Cas 3 : Aucun ID utilisateur fourni
      return res.status(400).json({
        error: "Identifiant utilisateur requis",
        details: "Fournissez soit un JWT valide, soit un utilisateur_id avec clé API"
      });
  
    } catch (error) {
      handleCreationError(res, error);
    }
  },

  /**
   * Lister tous les signalements avec pagination
   * GET /signalements
   */
  async findAll(req, res) {
    try {
      const { page = 1, limit = 10, statut, type } = req.query;
      const where = {};
      
      if (statut) where.statut = statut;
      if (type) where.type = type;

      const result = await Signalement.findAndCountAll({
        where,
        attributes: { exclude: ['utilisateur_id'] },
        include: [{
          model: Utilisateur,
          as: 'utilisateur',
          attributes: [ 'nom', 'prenom', 'email']
        }],
        limit: parseInt(limit),
        offset: (page - 1) * limit,
        order: [['dateSignalement', 'DESC']]
      });

      res.json({
        total: result.count,
        page: parseInt(page),
        totalPages: Math.ceil(result.count / limit),
        signalements: result.rows
      });
    } catch (error) {
      res.status(500).json({ 
        error: 'Erreur de récupération',
        details: error.message 
      });
    }
  },

  /**
   * Récupérer un signalement spécifique
   * GET /signalements/:id
   */
  async findOne(req, res) {
    try {
      const signalement = await Signalement.findByPk(req.params.id, {
        attributes: { exclude: ['utilisateur_id'] },
        include: [{
          model: Utilisateur,
          as: 'utilisateur',
          attributes: ['id', 'nom', 'prenom']
        }]
      });

      if (!signalement) {
        return res.status(404).json({ message: 'Signalement non trouvé' });
      }

      // Formatage de la localisation
      const response = signalement.toJSON();
      if (response.localisation) {
        response.localisation = response.localisation.coordinates; // [lng, lat]
      }

      res.json(response);
    } catch (error) {
      res.status(500).json({ 
        error: 'Erreur de récupération',
        details: error.message 
      });
    }
  },

  /**
   * Mettre à jour un signalement
   * PUT /signalements/:id
   */
  async update(req, res) {
    try {
      const [updated] = await Signalement.update(req.body, {
        where: { id: req.params.id }
      });

      if (!updated) {
        return res.status(404).json({ message: 'Signalement non trouvé' });
      }

      const updatedSignalement = await Signalement.findByPk(req.params.id, {
        attributes: { exclude: ['utilisateur_id'] }
      });

      res.json(updatedSignalement);
    } catch (error) {
      res.status(400).json({ 
        error: 'Erreur de mise à jour',
        details: error.message 
      });
    }
  },

  /**
   * Supprimer un signalement
   * DELETE /signalements/:id
   */
  async delete(req, res) {
    try {
      const deleted = await Signalement.destroy({
        where: { id: req.params.id }
      });

      if (!deleted) {
        return res.status(404).json({ message: 'Signalement non trouvé' });
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ 
        error: 'Erreur de suppression',
        details: error.message 
      });
    }
  },

  /**
   * Recherche géospatiale
   * GET /signalements/geosearch?lat=...&lng=...&radius=...
   */
  async geoSearch(req, res) {
    try {
      const { lat, lng, radius = 1000 } = req.query;
      const point = { 
        type: 'Point', 
        coordinates: [parseFloat(lng), parseFloat(lat)] 
      };

      const signalements = await Signalement.findAll({
        where: sequelize.where(
          sequelize.fn(
            'ST_DWithin',
            sequelize.col('localisation'),
            sequelize.fn('ST_SetSRID', sequelize.fn('ST_MakePoint', point.coordinates[0], point.coordinates[1]), 4326),
            parseInt(radius)
          ),
          true
        ),
        attributes: ['id', 'type', 'statut', 'dateSignalement']
      });

      res.json(signalements);
    } catch (error) {
      res.status(500).json({ 
        error: 'Erreur de recherche géospatiale',
        details: error.message 
      });
    }
  }
};