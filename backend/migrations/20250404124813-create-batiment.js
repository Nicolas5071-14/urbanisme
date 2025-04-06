'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Batiments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      referenceCadastrale: {
        type: Sequelize.STRING
      },
      typeBatiment: {
        type: Sequelize.STRING
      },
      adresse: {
        type: Sequelize.STRING
      },
      geometrie: {
        type: Sequelize.GEOMETRY
      },
      hauteur: {
        type: Sequelize.FLOAT
      },
      niveaux: {
        type: Sequelize.INTEGER
      },
      zoneUrbaine_id: {
        type: Sequelize.INTEGER,
        references: { model: 'ZoneUrbaines', key: 'id' },
        onDelete: 'CASCADE'
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
    await queryInterface.dropTable('Batiments');
  }
};