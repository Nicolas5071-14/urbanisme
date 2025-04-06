'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('DemandePermis', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      dateDepot: {
        type: Sequelize.DATE
      },
      statut: {
        type: Sequelize.ENUM,
        values: ['BROUILLON', 'SOUMIS', 'VALIDE', 'REJETE'],
        defaultValue: 'BROUILLON'
      },
      typePermis: {
        type: Sequelize.ENUM,
        values: ['CONSTRUCTION', 'COMMERCE', 'PUBLICITE']
      },
      description: {
        type: Sequelize.TEXT
      },
      documentsRequises: {
        type: Sequelize.TEXT
      },
      geometrie: {
        type: Sequelize.GEOMETRY
      },
      utilisateur_id: {
        type: Sequelize.INTEGER,
        references: { model: 'Utilisateurs', key: 'id' },
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
    await queryInterface.dropTable('DemandePermis');
  }
};