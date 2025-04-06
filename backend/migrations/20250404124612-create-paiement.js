'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Paiements', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      montant: {
        type: Sequelize.DECIMAL(10, 2), // Pour une précision monétaire
        allowNull: false
      },
      datePaiement: {
        type: Sequelize.DATE
      },
      methode: {
        type: Sequelize.ENUM,
        values: ['MOBILE_MONEY', 'ESPECES', 'BANQUE'],
        allowNull: false
      },
      reference: {
        type: Sequelize.STRING
      },
      statut: {
        type: Sequelize.STRING
      },
      permis_id: {
        type: Sequelize.INTEGER,
        references: { model: 'Permis', key: 'id' },
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
    await queryInterface.dropTable('Paiements');
  }
};