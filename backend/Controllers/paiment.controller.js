const { where } = require('sequelize');
const { Paiement , Permis} = require('../models');

module.exports = {
  async create(req, res) {
    try {
      const paiement = await Paiement.create(req.body);

      res.status(201).json(paiement);
      
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async findAll(req, res) {
    try {
      const paiements = await Paiement.findAll({
        include: [{
            model: Permis,
            as: 'Permis',
            attributes: [ 'numeroPermis', 'qrCode']
          }]
    });
      
      res.json(paiements);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async findOne(req, res) {
    try {
      const paiement = await Paiement.findByPk(req.params.id);
      if (!paiement) {
        return res.status(404).json({ error: 'Paiement non trouvé' });
      }
      res.json(paiement);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async update(req, res) {
    try {
      const [updated] = await Paiement.update(req.body, {
        where: { id: req.params.id }
      });

      if (!updated) {
        return res.status(404).json({ error: 'Paiement non trouvé' });
      }

      const paiement = await Paiement.findByPk(req.params.id);
      res.json(paiement);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async delete(req, res) {
    try {
      const paiement = await Paiement.findByPk(req.params.id);
      if (!paiement) {
        return res.status(404).json({ error: 'Paiement non trouvé' });
      }

      await paiement.destroy();
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};
