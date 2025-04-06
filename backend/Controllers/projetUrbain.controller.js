const { ProjetUrbain } = require('../models');

module.exports = {
  async create(req, res) {
    try {
      const projet = await ProjetUrbain.create(req.body);
      res.status(201).json(projet);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async findAll(req, res) {
    try {
      const projets = await ProjetUrbain.findAll();
      res.json(projets);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async findOne(req, res) {
    try {
      const projet = await ProjetUrbain.findByPk(req.params.id);
      if (!projet) return res.status(404).json({ error: 'Projet non trouvé' });
      res.json(projet);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async update(req, res) {
    try {
      const [updated] = await ProjetUrbain.update(req.body, {
        where: { id: req.params.id }
      });

      if (!updated) return res.status(404).json({ error: 'Projet non trouvé' });

      const projet = await ProjetUrbain.findByPk(req.params.id);
      res.json(projet);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async delete(req, res) {
    try {
      const projet = await ProjetUrbain.findByPk(req.params.id);
      if (!projet) return res.status(404).json({ error: 'Projet non trouvé' });

      await projet.destroy();
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};
