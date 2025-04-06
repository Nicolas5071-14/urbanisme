'use strict';
module.exports = (sequelize, DataTypes) => {
  const Document = sequelize.define('Document', {
    
    nomFichier: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('image', 'pdf', 'word', 'excel'),
      allowNull: false
    },
    taille: {
      type: DataTypes.DECIMAL(10, 2),
    },
    dateUpload: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    cheminStockage: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    tableName: 'Documents',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  });

  // Optionnel : définir les associations (s'il y en a)
  Document.associate = function(models) {
    Document.belongsToMany(models.Batiment, {
      through: models.BatimentDocument,
      foreignKey: 'document_id',
      otherKey: 'batiment_id',
      as: 'batiments' // Cet alias doit correspondre à celui utilisé dans l'include
    });
  };

  return Document;
};