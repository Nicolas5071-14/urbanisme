// controllers/utilisateur.controller.js
const { Utilisateur } = require('../models');
const { Sequelize } = require('sequelize');
module.exports = {
    async create(req, res) {
        try {
            const utilisateur = await Utilisateur.create(req.body);
            res.status(201).json(utilisateur);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async findAll(req, res) {
        try {
            const utilisateurs = await Utilisateur.findAll();
            res.json(utilisateurs);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async findOne(req, res) {
        try {
            const utilisateur = await Utilisateur.findByPk(req.params.id);
            if (!utilisateur) return res.status(404).json({ message: 'Not found' });
            res.json(utilisateur);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async update(req, res) {
        try {
            const [updated] = await Utilisateur.update(req.body, {
                where: { id: req.params.id }
            });
            if (!updated) return res.status(404).json({ message: 'Not found' });
            const updatedUtilisateur = await Utilisateur.findByPk(req.params.id);
            res.json(updatedUtilisateur);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async delete(req, res) {
        try {
            const deleted = await Utilisateur.destroy({ where: { id: req.params.id } });
            if (!deleted) return res.status(404).json({ message: 'Not found' });
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    async findByRole(req, res) {
        try {
          const { role } = req.params;
          const validRoles = ['CITOYEN', 'AGENT', 'ADMIN'];
      
          // Conversion et validation
          const roleRecherche = role.toUpperCase();
          if (!validRoles.includes(roleRecherche)) {
            return res.status(400).json({
              error: `Rôle invalide. Options : ${validRoles.join(', ')}`,
              valeur_reçue: role
            });
          }
      
          // Requête optimisée
          const utilisateurs = await Utilisateur.findAll({
            where: {
              role: {
                [Sequelize.Op.iLike]: roleRecherche // Recherche insensible à la casse
              }
            }
          });
      
          // Gestion des résultats
          if (!utilisateurs.length) {
            const rolesExistants = await Utilisateur.findAll({
              attributes: ['role'],
              group: 'role',
              raw: true
            });
            
            return res.json({
              avertissement: `Aucun "${roleRecherche}" trouvé`,
              roles_disponibles: [...new Set(rolesExistants.map(r => r.role))]
            });
          }
          res.json(utilisateurs);
      
        } catch (error) {
          res.status(500).json({ 
            error: error.message,
            conseil: "Vérifiez que le type 'role' est bien un STRING et non un ENUM dans votre modèle"
          });
        }
      }
};
