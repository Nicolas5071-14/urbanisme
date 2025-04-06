const { Document, Batiment } = require('../models');

const DocumentController = {
  // Créer un nouveau document
  async create(req, res) {
    try {
      // Assure-toi que les champs sont bien envoyés dans la requête
      const { nomFichier, type, taille, cheminStockage } = req.body;
  
      // Vérifier si tous les champs nécessaires sont présents
      if (!nomFichier || !type || !cheminStockage) {
        return res.status(400).json({ message: "Tous les champs obligatoires doivent être fournis." });
      }
  
      const document = await Document.create({
        nomFichier,
        type,
        taille,
        cheminStockage
      });
  
      return res.status(201).json(document);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  // Obtenir tous les documents
  async getAll(req, res) {
    try {
      const documents = await Document.findAll();
      return res.status(200).json(documents);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  // Obtenir un document par ID
  async getById(req, res) {
    try {
      const document = await Document.findByPk(req.params.id, {
        include: [{
          model: Batiment,
          as: 'batiments',
          through: { attributes: [] }, // Exclut les champs de la table de liaison
          attributes: ['referenceCadastrale', 'typeBatiment', 'adresse'],
          required: false // Left join pour inclure même sans bâtiments associés
        }]
      });
  
      if (!document) {
        return res.status(404).json({ 
          error: 'Document non trouvé',
          details: `Aucun document avec l'ID ${req.params.id}`
        });
      }
  
      // Formatage de la réponse
      const response = {
        id: document.id,
        nomFichier: document.nomFichier,
        type: document.type,
        taille: document.taille,
        dateUpload: document.dateUpload,
        batiments: document.batiments.map(b => ({
          id: b.id,
          referenceCadastrale: b.referenceCadastrale,
          typeBatiment: b.typeBatiment,
          adresse: b.adresse
        }))
      };
  
      res.status(200).json(response);
    } catch (error) {
      console.error(`Erreur lors de la récupération du document ${req.params.id}:`, error);
      res.status(500).json({
        error: 'Erreur serveur',
        details: process.env.NODE_ENV === 'development' 
          ? error.message 
          : 'Une erreur est survenue lors de la récupération'
      });
    }
  },

  // Mettre à jour un document
  async update(req, res) {
    try {
      const { nomFichier, type, taille, cheminStockage } = req.body;
      const document = await Document.findByPk(req.params.id);
      if (!document) {
        return res.status(404).json({ message: 'Document non trouvé' });
      }
      await document.update({ nomFichier, type, taille, cheminStockage });
      return res.status(200).json(document);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  // Supprimer un document
  async delete(req, res) {
    try {
      const document = await Document.findByPk(req.params.id);
      if (!document) {
        return res.status(404).json({ message: 'Document non trouvé' });
      }
      await document.destroy();
      return res.status(204).json();
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
};

module.exports = DocumentController;
