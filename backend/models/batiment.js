'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Batiment extends Model {
    static associate(models) {
      // Association Many-to-Many avec Document
      Batiment.belongsToMany(models.Document, {
        through: models.BatimentDocument,
        foreignKey: 'batiment_id',
        otherKey: 'document_id',
        as: 'documents'
      });

      // Association Many-to-One avec ZoneUrbaine
      Batiment.belongsTo(models.ZoneUrbaine, {
        foreignKey: 'zoneUrbaine_id',
        as: 'zoneUrbaine',
        onDelete: 'CASCADE'
      });
    }
  }

  Batiment.init({
    referenceCadastrale: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true
      }
    },
    typeBatiment: {
      type: DataTypes.ENUM(
        'RESIDENTIEL', 
        'COMMERCIAL', 
        'INDUSTRIEL', 
        'PUBLIC', 
        'RELIGIEUX'
      ),
      allowNull: false
    },
    adresse: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    geometrie: {
      type: DataTypes.GEOMETRY('POLYGON'),
      allowNull: false
    },
    hauteur: {
      type: DataTypes.FLOAT,
      validate: {
        min: 0
      }
    },
    niveaux: {
      type: DataTypes.INTEGER,
      validate: {
        min: 0
      }
    },
    zoneUrbaine_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { 
        model: 'ZoneUrbaines', 
        key: 'id' 
      }
    }
  }, {
    sequelize,
    modelName: 'Batiment',
    // paranoid: true // Active le soft delete  
  });

  return Batiment;
};