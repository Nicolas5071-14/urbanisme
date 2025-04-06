// controllers/infrastructure.controller.js
const { Infrastructure, ZoneUrbaine } = require('../models');
const { Op } = require('sequelize');

module.exports = {
  /**
   * Créer une infrastructure
   * POST /infrastructures
   */
  async create(req, res) {
    try {
      const { geometrie, ...data } = req.body;
      
      // Conversion de la géométrie si nécessaire
      const geom = Array.isArray(geometrie) 
        ? { type: 'LineString', coordinates: geometrie } 
        : geometrie;

      const infrastructure = await Infrastructure.create({
        ...data,
        geometrie: geom,
        dateInstallation: data.dateInstallation || new Date() // Date actuelle par défaut
      });

      res.status(201).json({
        id: infrastructure.id,
        type: infrastructure.type,
        etat: infrastructure.etat,
        zoneUrbaine_id: infrastructure.zoneUrbaine_id
      });
    } catch (error) {
      res.status(400).json({ 
        error: 'Erreur de création',
        details: error.message 
      });
    }
  },

  /**
   * Lister les infrastructures avec filtres
   * GET /infrastructures
   */
  async findAll(req, res) {
    try {
      const { type, etat, zoneUrbaine_id } = req.query;
      const where = {};
      
      if (type) where.type = type;
      if (etat) where.etat = etat;
      if (zoneUrbaine_id) where.zoneUrbaine_id = zoneUrbaine_id;

      const infrastructures = await Infrastructure.findAll({
        where,
        include: [{
          model: ZoneUrbaine,
          attributes: ['id', 'nom', 'code']
        }],
        order: [['dateInstallation', 'DESC']]
      });

      // Formatage des géométries
      const result = infrastructures.map(infra => {
        const json = infra.toJSON();
        if (json.geometrie) {
          json.geometrie = json.geometrie.coordinates;
        }
        return json;
      });

      res.json(result);
    } catch (error) {
      res.status(500).json({ 
        error: 'Erreur de récupération',
        details: error.message 
      });
    }
  },

  /**
   * Récupérer une infrastructure spécifique
   * GET /infrastructures/:id
   */
  async findOne(req, res) {
    try {
      const infrastructure = await Infrastructure.findByPk(req.params.id, {
        include: [{
          model: ZoneUrbaine,
          attributes: ['id', 'nom']
        }]
      });

      if (!infrastructure) {
        return res.status(404).json({ message: 'Infrastructure non trouvée' });
      }

      // Formatage de la géométrie
      const response = infrastructure.toJSON();
      if (response.geometrie) {
        response.geometrie = response.geometrie.coordinates;
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
   * Mettre à jour une infrastructure
   * PUT /infrastructures/:id
   */
  async update(req, res) {
    try {
      const [updated] = await Infrastructure.update(req.body, {
        where: { id: req.params.id }
      });

      if (!updated) {
        return res.status(404).json({ message: 'Infrastructure non trouvée' });
      }

      const updatedInfra = await Infrastructure.findByPk(req.params.id);
      res.json(updatedInfra);
    } catch (error) {
      res.status(400).json({ 
        error: 'Erreur de mise à jour',
        details: error.message 
      });
    }
  },

  /**
   * Supprimer une infrastructure
   * DELETE /infrastructures/:id
   */
  async delete(req, res) {
    try {
      const deleted = await Infrastructure.destroy({
        where: { id: req.params.id }
      });

      if (!deleted) {
        return res.status(404).json({ message: 'Infrastructure non trouvée' });
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
   * GET /infrastructures/near?lat=...&lng=...&distance=...
   */
  async findNear(req, res) {
    try {
      const { lat, lng, distance = 1000 } = req.query;
      const point = { 
        type: 'Point', 
        coordinates: [parseFloat(lng), parseFloat(lat)] 
      };

      const infrastructures = await Infrastructure.findAll({
        where: sequelize.where(
          sequelize.fn(
            'ST_DWithin',
            sequelize.col('geometrie'),
            sequelize.fn('ST_SetSRID', sequelize.fn('ST_MakePoint', point.coordinates[0], point.coordinates[1]), 4326),
            parseInt(distance)
          ),
          true
        ),
        attributes: ['id', 'type', 'etat']
      });

      res.json(infrastructures);
    } catch (error) {
      res.status(500).json({ 
        error: 'Erreur de recherche géospatiale',
        details: error.message 
      });
    }
  }
};