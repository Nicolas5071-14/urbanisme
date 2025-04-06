const { Batiment, ZoneUrbaine, Document } = require('../models');
const { Op } = require('sequelize');


  // Fonctions utilitaires
  const formatGeometrie = (geom) => 
    Array.isArray(geom) ? { type: 'Polygon', coordinates: [geom] } : geom;
  
  const batimentWithAssociations = async (id) => {
    return Batiment.findByPk(id, {
      include: [
        { model: Document, as: 'documents', attributes: ['id', 'nomFichier'] },
        { model: ZoneUrbaine, as: 'zoneUrbaine', attributes: ['id', 'nom'] }
      ]
    });
  };
  
  const handleError = (res, error) => {
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({
        error: "Violation de contrainte référentielle",
        details: error.parent.detail
      });
    }
    res.status(400).json({ 
      error: 'Erreur de création',
      details: error.message 
    });
  };
module.exports = {
  /**
   * Créer un bâtiment
   * POST /batiments
   */
  async create(req, res) {
    try {
      const { geometrie, documents = [], ...data } = req.body;
  
      // Validation des documents existants
      if (documents.length > 0) {
        const existingDocs = await Document.count({
          where: { id: documents }
        });
        
        if (existingDocs !== documents.length) {
          return res.status(400).json({
            error: "Un ou plusieurs documents n'existent pas",
            details: `Sur ${documents.length} documents fournis, seulement ${existingDocs} existent en base`
          });
        }
      }
  
      // Création du bâtiment
      const geom = formatGeometrie(geometrie);
      const batiment = await Batiment.create({ ...data, geometrie: geom });
  
      // Association des documents (seulement si validation OK)
      if (documents.length) {
        await batiment.addDocuments(documents); // Utilisez addDocuments au lieu de setDocuments pour éviter de supprimer des associations existantes
      }
  
      res.status(201).json(await batimentWithAssociations(batiment.id));
    } catch (error) {
      handleError(res, error);
    }
  }
  ,

  /**
   * Lister les bâtiments avec filtres
   * GET /batiments
   */
  async findAll(req, res) {
    try {
      const { typeBatiment, zoneUrbaine_id, search } = req.query;
      const where = {};
      
      if (typeBatiment) where.typeBatiment = typeBatiment;
      if (zoneUrbaine_id) where.zoneUrbaine_id = zoneUrbaine_id;
      if (search) {
        where[Op.or] = [
          { referenceCadastrale: { [Op.iLike]: `%${search}%` } },
          { adresse: { [Op.iLike]: `%${search}%` } }
        ];
      }

      const batiments = await Batiment.findAll({
        where,
        include: [
          {
            model: ZoneUrbaine,
            as: 'zoneUrbaine',
            attributes: ['id', 'nom']
          },
          {
            model: Document,
            as: 'documents',
            attributes: ['id', 'nomFichier'],
            through: { attributes: [] } // Exclut les champs de la table de liaison
          }
        ],
        order: [['referenceCadastrale', 'ASC']]
      });

      res.json(batiments);
    } catch (error) {
      res.status(500).json({
        error: 'Erreur de récupération',
        details: error.message
      });
    }
  },

  /**
   * Récupérer un bâtiment spécifique
   * GET /batiments/:id
   */
  async findOne(req, res) {
    try {
      const batiment = await Batiment.findByPk(req.params.id, {
        include: [
          {
            model: ZoneUrbaine,
            as: 'zoneUrbaine',
            attributes: ['id', 'nom', 'code']
          },
          {
            model: Document,
            as: 'documents',
            attributes: ['id', 'nomFichier', 'type'],
            through: { attributes: [] }
          }
        ]
      });

      if (!batiment) {
        return res.status(404).json({ message: 'Bâtiment non trouvé' });
      }

      // Formatage de la géométrie
      const response = batiment.toJSON();
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
   * Mettre à jour un bâtiment
   * PUT /batiments/:id
   */
  async update(req, res) {
    try {
      const [updated] = await Batiment.update(req.body, {
        where: { id: req.params.id }
      });

      if (!updated) {
        return res.status(404).json({ message: 'Bâtiment non trouvé' });
      }

      // Gestion des documents associés
      if (req.body.documents) {
        const batiment = await Batiment.findByPk(req.params.id);
        await batiment.setDocuments(req.body.documents);
      }

      const updatedBatiment = await Batiment.findByPk(req.params.id, {
        include: [{
          model: Document,
          as: 'documents',
          attributes: ['id'],
          through: { attributes: [] }
        }]
      });

      res.json(updatedBatiment);
    } catch (error) {
      res.status(400).json({
        error: 'Erreur de mise à jour',
        details: error.message
      });
    }
  },

  /**
   * Supprimer un bâtiment (soft delete)
   * DELETE /batiments/:id
   */
  async delete(req, res) {
    try {
      const deleted = await Batiment.destroy({
        where: { id: req.params.id }
      });

      if (!deleted) {
        return res.status(404).json({ message: 'Bâtiment non trouvé' });
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
   * Recherche spatiale
   * GET /batiments/within?lat=...&lng=...&distance=...
   */
  async findWithinRadius(req, res) {
    try {
      const { lat, lng, distance = 1000 } = req.query;
      const point = { 
        type: 'Point', 
        coordinates: [parseFloat(lng), parseFloat(lat)] 
      };

      const batiments = await Batiment.findAll({
        where: sequelize.where(
          sequelize.fn(
            'ST_DWithin',
            sequelize.col('geometrie'),
            sequelize.fn('ST_SetSRID', sequelize.fn('ST_MakePoint', point.coordinates[0], point.coordinates[1]), 4326),
            parseInt(distance)
          ),
          true
        ),
        attributes: ['id', 'referenceCadastrale', 'typeBatiment', 'adresse']
      });

      res.json(batiments);
    } catch (error) {
      res.status(500).json({
        error: 'Erreur de recherche spatiale',
        details: error.message
      });
    }
  }
};