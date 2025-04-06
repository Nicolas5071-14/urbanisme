'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Documents', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nomFichier: {
        type: Sequelize.STRING,
        allowNull: false
      },
      type: {
        type: Sequelize.ENUM(['image', 'pdf', 'word', 'excel']),
        allowNull: false
      },
      taille: {
        type: Sequelize.DECIMAL(10,2) // 10 chiffres total, 2 décimales
      },
      dateUpload: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      cheminStockage: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
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
    
    // Ajout d'index pour optimisation
    await queryInterface.addIndex('Documents', ['type']);
    await queryInterface.addIndex('Documents', ['dateUpload']);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Documents');
  }
};