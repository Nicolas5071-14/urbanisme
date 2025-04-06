'use strict';
module.exports = (sequelize, DataTypes) => {
  const Paiement = sequelize.define('Paiement', {
    montant: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    datePaiement: DataTypes.DATE,
    methode: {
      type: DataTypes.ENUM('MOBILE_MONEY', 'ESPECES', 'BANQUE'),
      allowNull: false
    },
    reference: DataTypes.STRING,
    statut: DataTypes.STRING,
    permis_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});

  Paiement.associate = function(models) {
    Paiement.belongsTo(models.Permis, {
      foreignKey: 'permis_id',
      onDelete: 'CASCADE',
      as:'Permis'
    });
  };

  return Paiement;
};
