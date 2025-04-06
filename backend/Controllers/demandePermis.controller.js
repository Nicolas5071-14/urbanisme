const { DemandePermis } = require('../models');

module.exports = {
  async create(req, res) {
    try {
      const demande = await DemandePermis.create({
        ...req.body,
        utilisateur_id: req.body.utilisateur_id
      });
      res.status(201).json(demande);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async findAll(req, res) {
    try {
      const demandes = await DemandePermis.findAll({
        attributes: {
            exclude: ['utilisateur_id'] // <-- Exclut explicitement ce champ
          },
        include: [{ association: 'demandeur', attributes: ['email','nom', 'prenom'] }]
      });
      res.json(demandes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async findByStatus(req, res) {
    try {
      const demandes = await DemandePermis.findAll({
        where: { statut: req.params.statut },
        order: [['dateDepot', 'DESC']]
      });
      res.json(demandes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async updateDocuments(req, res) {
    try {
      const [updated] = await DemandePermis.update({
        documentsRequises: req.body.documents
      }, {
        where: { id: req.params.id }
      });
      
      if (!updated) return res.status(404).json({ message: 'Non trouvé' });
      res.json(await DemandePermis.findByPk(req.params.id));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async updateGeometry(req, res) {
    try {
      const [updated] = await DemandePermis.update({
        geometrie: req.body.geometrie
      }, {
        where: { id: req.params.id }
      });
      
      if (!updated) return res.status(404).json({ message: 'Non trouvé' });
      res.json(await DemandePermis.findByPk(req.params.id));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async delete(req, res) {
    try {
      const deleted = await DemandePermis.destroy({ where: { id: req.params.id } });
      if (!deleted) return res.status(404).json({ message: 'Non trouvé' });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};