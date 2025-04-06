const { Permis, DemandePermis } = require('../models');
const QRCode = require('qrcode');
const { Op } = require('sequelize');

const generateQRCode = async (data) => {
    try {
      return await QRCode.toDataURL(JSON.stringify(data));
    } catch (error) {
      throw new Error('Échec de génération du QR Code');
    }
  };
module.exports = {
    async create(req, res) {
        try {
          const { demandePermis_id, ...permisData } = req.body;
          
          // Appel direct sans this
          const qrCodeData = await generateQRCode({
            numero: permisData.numeroPermis,
            dateValidation: permisData.dateValidation
          });
    
          const permis = await Permis.create({
            ...permisData,
            qrCode: qrCodeData,
            demandePermis_id
          });
    
          res.status(201).json({
            id: permis.id,
            numeroPermis: permis.numeroPermis,
            qrCode: permis.qrCode,
            links: {
              self: `/permis/${permis.id}`,
              demande: `/demande-permis/${demandePermis_id}`
            }
          });
        } catch (error) {
          res.status(400).json({
            error: 'Erreur de création du permis',
            details: error.message
          });
        }
      },

  async findAll(req, res) {
    try {
      const { page = 1, limit = 10, valid } = req.query;
      const where = {};
      
      if (valid === 'true') {
        where.dateExpiration = { [Op.gt]: new Date() };
      }

      const { count, rows } = await Permis.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset: (page - 1) * limit,
        include: [{
          model: DemandePermis,
          as: 'demandeAssociee',
          attributes: ['typePermis', 'statut']
        }]
      });

      res.json({
        total: count,
        page: parseInt(page),
        totalPages: Math.ceil(count / limit),
        permis: rows.map(p => ({
          ...p.get({ plain: true }),
          qrCode: undefined // Retirer le QR code de la liste
        }))
      });
    } catch (error) {
      res.status(500).json({
        error: 'Erreur de récupération',
        details: error.message
      });
    }
  },

  async findOne(req, res) {
    try {
      const permis = await Permis.findByPk(req.params.id, {
        include: [{
          model: DemandePermis,
          as: 'demandeAssociee',
          attributes: [ 'typePermis', 'description']
        }]
      });

      if (!permis) {
        return res.status(404).json({ error: 'Permis non trouvé' });
      }

      res.json(permis);
    } catch (error) {
      res.status(500).json({
        error: 'Erreur de récupération',
        details: error.message
      });
    }
  },

  async update(req, res) {
    try {
      const [updated] = await Permis.update(req.body, {
        where: { id: req.params.id }
      });

      if (!updated) {
        return res.status(404).json({ error: 'Permis non trouvé' });
      }

      const updatedPermis = await Permis.findByPk(req.params.id, {
        attributes: { exclude: ['qrCode'] }
      });

      res.json(updatedPermis);
    } catch (error) {
      res.status(400).json({
        error: 'Erreur de mise à jour',
        details: error.message
      });
    }
  },

  async delete(req, res) {
    try {
      const deleted = await Permis.destroy({ where: { id: req.params.id } });
      if (!deleted) {
        return res.status(404).json({ error: 'Permis non trouvé' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({
        error: 'Erreur de suppression',
        details: error.message
      });
    }
  }
};