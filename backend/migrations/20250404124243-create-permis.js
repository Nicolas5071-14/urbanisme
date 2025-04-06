'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Permis', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      numeroPermis: {
        type: Sequelize.STRING
      },
      dateValidation: {
        type: Sequelize.DATE
      },
      dateExpiration: {
        type: Sequelize.DATE
      },
      conditions: {
        type: Sequelize.TEXT
      },
      qrCode: {
        type: Sequelize.STRING
      },
      demandePermis_id: {
        type: Sequelize.INTEGER,
        references: { model: 'DemandePermis', key: 'id' },
        onDelete: 'SET NULL'
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
    await queryInterface.dropTable('Permis');
  }
};