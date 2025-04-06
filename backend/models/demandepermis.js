'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DemandePermis extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      DemandePermis.belongsTo(models.Utilisateur, {
        foreignKey: 'utilisateur_id', // Clé étrangère dans DemandePermis
        as: 'demandeur' // Alias pour les requêtes
      });
    }
  }
  DemandePermis.init({
    dateDepot: DataTypes.DATE,
    statut: DataTypes.ENUM('BROUILLON', 'SOUMIS', 'VALIDE', 'REJETE'),
    typePermis: DataTypes.ENUM('CONSTRUCTION', 'COMMERCE', 'PUBLICITE'),
    description: DataTypes.TEXT,
    documentsRequises: DataTypes.TEXT,
    geometrie: DataTypes.GEOMETRY,
    utilisateur_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'DemandePermis',
  });
  return DemandePermis;
};