const { BatimentDocument, Batiment, Document } = require('../models');

module.exports = {
  /**
   * Associer un document à un bâtiment
   * POST /batiment-documents
   */
  async createAssociation(req, res) {
    try {
      const { batiment_id, document_id } = req.body;

      // Vérification de l'existence des entités
      const [batiment, document] = await Promise.all([
        Batiment.findByPk(batiment_id),
        Document.findByPk(document_id)
      ]);

      if (!batiment || !document) {
        return res.status(404).json({
          error: 'Entité non trouvée',
          batiment_exists: !!batiment,
          document_exists: !!document
        });
      }

      // Création de l'association
      const association = await BatimentDocument.create({
        batiment_id,
        document_id
      });

      res.status(201).json({
        message: 'Association créée avec succès',
        association: {
          id: association.id,
          batiment_id: association.batiment_id,
          document_id: association.document_id
        }
      });
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({
          error: 'Association déjà existante',
          details: 'Ce document est déjà associé à ce bâtiment'
        });
      }
      res.status(500).json({
        error: 'Erreur lors de la création de l\'association',
        details: error.message
      });
    }
  },

  /**
   * Supprimer une association
   * DELETE /batiment-documents/:id
   */
  async deleteAssociation(req, res) {
    try {
      const deleted = await BatimentDocument.destroy({
        where: { id: req.params.id }
      });

      if (!deleted) {
        return res.status(404).json({ 
          error: 'Association non trouvée' 
        });
      }

      res.status(204).end();
    } catch (error) {
      res.status(500).json({
        error: 'Erreur lors de la suppression',
        details: error.message
      });
    }
  },

  /**
   * Lister toutes les associations pour un bâtiment
   * GET /batiment-documents/batiment/:batiment_id
   */
  async getDocumentsForBatiment(req, res) {
    try {
      const documents = await Document.findAll({
        include: [{
          model: Batiment,
          where: { id: req.params.batiment_id },
          attributes: [],
          through: { attributes: [] }
        }]
      });

      res.json(documents);
    } catch (error) {
      res.status(500).json({
        error: 'Erreur de récupération',
        details: error.message
      });
    }
  },

  /**
   * Lister tous les bâtiments pour un document
   * GET /batiment-documents/document/:document_id
   */
  async getBatimentsForDocument(req, res) {
    try {
      const batiments = await Batiment.findAll({
        include: [{
          model: Document,
          where: { id: req.params.document_id },
          attributes: [],
          through: { attributes: [] }
        }]
      });

      res.json(batiments);
    } catch (error) {
      res.status(500).json({
        error: 'Erreur de récupération',
        details: error.message
      });
    }
  }
};