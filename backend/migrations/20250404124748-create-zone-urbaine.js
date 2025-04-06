'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ZoneUrbaines', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nom: {
        type: Sequelize.STRING
      },
      code: {
        type: Sequelize.STRING,
        unique: true // Si le code doit être unique
      },
      typeZone: {
        type: Sequelize.ENUM('HABITATION', 'COMMERCE', 'INDUSTRIEL'),
        allowNull: false // Si le champ est obligatoire
      },
      geometrie: {
        type: Sequelize.GEOMETRY,
        allowNull: false // Adaptez selon vos besoins
      },
      reglementation: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ZoneUrbaines');
  }
};