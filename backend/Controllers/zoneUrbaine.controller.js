// controllers/zoneUrbaine.controller.js
const { ZoneUrbaine, Infrastructure} = require('../models');
const { Op } = require('sequelize');

module.exports = {
  /**
   * Créer une zone urbaine
   * POST /zone-urbaines
   */
  async create(req, res) {
    try {
      const { geometrie, ...data } = req.body;

      // Conversion de la géométrie si nécessaire
      const geom = Array.isArray(geometrie) 
        ? { type: 'Polygon', coordinates: [geometrie] } 
        : geometrie;

      const zone = await ZoneUrbaine.create({
        ...data,
        geometrie: geom
      });

      res.status(201).json({
        id: zone.id,
        nom: zone.nom,
        code: zone.code,
        typeZone: zone.typeZone
      });
    } catch (error) {
      res.status(400).json({ 
        error: 'Erreur de création',
        details: error.message.includes('unique constraint') 
          ? 'Le code de zone doit être unique'
          : error.message
      });
    }
  },

  /**
   * Lister les zones urbaines avec filtres
   * GET /zone-urbaines
   */
  async findAll(req, res) {
    try {
      const { typeZone, search } = req.query;
      const where = {};
      
      if (typeZone) where.typeZone = typeZone;
      if (search) {
        where[Op.or] = [
          { nom: { [Op.iLike]: `%${search}%` } },
          { code: { [Op.iLike]: `%${search}%` } }
        ];
      }

      const zones = await ZoneUrbaine.findAll({
        where,
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        include: [{
            model: Infrastructure,
            as: 'infrastructures',
            attributes: [ 'type', 'etat']
          }],
        order: [['nom', 'ASC']]
      });

      // Formatage des géométries
      const result = zones.map(zone => {
        const json = zone.toJSON();
        if (json.geometrie) {
          json.geometrie = json.geometrie.coordinates[0]; // Extraction des coordonnées
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
   * Récupérer une zone spécifique
   * GET /zone-urbaines/:id
   */
  async findOne(req, res) {
    try {
      const zone = await ZoneUrbaine.findByPk(req.params.id, {
        include: [{
          model: Infrastructure,
          as: 'infrastructures',
          attributes: ['id', 'type', 'etat']
        }]
      });

      if (!zone) {
        return res.status(404).json({ message: 'Zone urbaine non trouvée' });
      }

      // Formatage de la géométrie
      const response = zone.toJSON();
      if (response.geometrie) {
        response.geometrie = response.geometrie.coordinates[0];
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
   * Mettre à jour une zone urbaine
   * PUT /zone-urbaines/:id
   */
  async update(req, res) {
    try {
      const [updated] = await ZoneUrbaine.update(req.body, {
        where: { id: req.params.id }
      });

      if (!updated) {
        return res.status(404).json({ message: 'Zone urbaine non trouvée' });
      }

      const updatedZone = await ZoneUrbaine.findByPk(req.params.id, {
        attributes: { exclude: ['createdAt', 'updatedAt'] }
      });

      res.json(updatedZone);
    } catch (error) {
      res.status(400).json({ 
        error: 'Erreur de mise à jour',
        details: error.message.includes('unique constraint')
          ? 'Le code de zone doit être unique'
          : error.message
      });
    }
  },

  /**
   * Supprimer une zone urbaine
   * DELETE /zone-urbaines/:id
   */
  async delete(req, res) {
    try {
      const deleted = await ZoneUrbaine.destroy({
        where: { id: req.params.id }
      });

      if (!deleted) {
        return res.status(404).json({ message: 'Zone urbaine non trouvée' });
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ 
        error: 'Erreur de suppression',
        details: error.message.includes('foreign key constraint')
          ? 'Impossible de supprimer : la zone contient des infrastructures'
          : error.message
      });
    }
  },

  /**
   * Recherche géospatiale (zones contenant un point)
   * GET /zone-urbaines/contains?lat=...&lng=...
   */
  async findZonesContainingPoint(req, res) {
    try {
      const { lat, lng } = req.query;
      const point = { 
        type: 'Point', 
        coordinates: [parseFloat(lng), parseFloat(lat)] 
      };

      const zones = await ZoneUrbaine.findAll({
        where: sequelize.where(
          sequelize.fn(
            'ST_Contains',
            sequelize.col('geometrie'),
            sequelize.fn('ST_SetSRID', sequelize.fn('ST_MakePoint', point.coordinates[0], point.coordinates[1]), 4326)
          ),
          true
        ),
        attributes: ['id', 'nom', 'code', 'typeZone']
      });

      res.json(zones);
    } catch (error) {
      res.status(500).json({ 
        error: 'Erreur de recherche géospatiale',
        details: error.message 
      });
    }
  }
};