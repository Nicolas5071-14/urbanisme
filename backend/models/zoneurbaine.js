'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ZoneUrbaine extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ZoneUrbaine.hasMany(models.Infrastructure, {
        foreignKey: 'zoneUrbaine_id',
        as: 'infrastructures'
      });
    }
  }
  ZoneUrbaine.init({
    nom: DataTypes.STRING,
    code: DataTypes.STRING,
    typeZone: DataTypes.ENUM('HABITATION', 'COMMERCE', 'INDUSTRIEL'),
    reglementation: DataTypes.TEXT,
    geometrie: DataTypes.GEOMETRY
  }, {
    sequelize,
    modelName: 'ZoneUrbaine',
  });
  return ZoneUrbaine;
};