'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Infrastructure extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Infrastructure.belongsTo(models.ZoneUrbaine, {
        foreignKey: 'zoneUrbaine_id',
        as: 'zoneUrbaine'
      });
    }
  }
  Infrastructure.init({
    type: {
      type: DataTypes.ENUM(['ROUTE', 'CANALISATION', 'RESEAU_ELECTRIQUE']),
      allowNull: false
    },
    etat: {
      type: DataTypes.ENUM(['FONCTIONNEL','EN_PANNE','EN_CONSTRUCTION','HORS_SERVICE']),
      defaultValue: 'FONCTIONNEL'
    },
    geometrie: DataTypes.GEOMETRY,
    dateInstallation: DataTypes.DATE,
    zoneUrbaine_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Infrastructure',
  });
  return Infrastructure;
};