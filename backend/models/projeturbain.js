'use strict';
module.exports = (sequelize, DataTypes) => {
  const ProjetUrbain = sequelize.define('ProjetUrbain', {
    nom: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 500]
      }
    },
    description: DataTypes.TEXT,
    dateDebut: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    dateFin: {
      type: DataTypes.DATEONLY
    },
    budget: {
      type: DataTypes.DECIMAL(12, 2),
      get() {
        return parseFloat(this.getDataValue('budget')) || 0;
      }
    },
    geometrie: {
      type: DataTypes.GEOMETRY('POLYGON'),
      allowNull: false
    },
    statut: {
      type: DataTypes.ENUM('planification', 'en_cours', 'suspendu', 'acheve', 'abandonne'),
      defaultValue: 'planification'
    }
  }, {});
  
  ProjetUrbain.associate = function(models) {
    // À compléter si associations plus tard
  };

  return ProjetUrbain;
};
