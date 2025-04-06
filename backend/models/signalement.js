'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Signalement extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
           Signalement.belongsTo(models.Utilisateur, {
          foreignKey: 'utilisateur_id',
          as: 'utilisateur'  // Optionnel : alias pour les requêtes
        });
    }
    
    
  }
 
  Signalement.init({
    dateSignalement: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW, // Date actuelle automatique
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM(['CONSTRUCTION_ILLICITE', 'DEGRADATION']),
      allowNull: false
    },
    statut: {
      type: DataTypes.ENUM(['NOUVEAU', 'EN_COURS', 'RESOLU', 'REJETE']),
      defaultValue: 'NOUVEAU'
    },
    localisation: {
      type: DataTypes.GEOMETRY('POINT'),
      allowNull: false
    },
    photos: {
      type: DataTypes.ARRAY(DataTypes.TEXT), // Pour PostgreSQL
      defaultValue: []
    },
    utilisateur_id: DataTypes.INTEGER
  }, {
    
    sequelize,
    modelName: 'Signalement',
  });
  
  

  return Signalement;
};