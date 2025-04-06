'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Utilisateur extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Utilisateur.hasMany(models.DemandePermis, {
        foreignKey: 'utilisateur_id',
        as: 'demandesPermis'
      });
      Utilisateur.associate = function(models) {
        Utilisateur.hasMany(models.Signalement, {
          foreignKey: 'utilisateur_id',
          as: 'signalements'  // Optionnel
        });
      };
    }
  }
 
  Utilisateur.init({
    nom: DataTypes.STRING,
    prenom: DataTypes.STRING,
    email: DataTypes.STRING,
    motDePasse: DataTypes.STRING,
    role: DataTypes.ENUM('CITOYEN', 'AGENT', 'ADMIN'),
    telephone: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Utilisateur',
  });
  return Utilisateur;
};