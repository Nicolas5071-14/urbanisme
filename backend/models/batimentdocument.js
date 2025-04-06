'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class BatimentDocument extends Model {
    static associate(models) {
      // Les associations sont déjà définies dans les modèles Batiment et Document
    }
  }

  BatimentDocument.init({
    batiment_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Batiments',
        key: 'id'
      }
    },
    document_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Documents',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'BatimentDocument',
    tableName: 'BatimentDocuments',
    timestamps: false, // Désactive les champs createdAt/updatedAt
    indexes: [
      {
        unique: true,
        fields: ['batiment_id', 'document_id'],
        name: 'batiment_document_composite_unique'
      }
    ]
  });

  return BatimentDocument;
};