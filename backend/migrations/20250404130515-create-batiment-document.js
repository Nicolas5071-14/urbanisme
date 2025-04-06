'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('BatimentDocuments', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      batiment_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Batiments',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      document_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Documents',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }
    });

    // Ajout d'un index composite unique pour éviter les doublons
    await queryInterface.addIndex('BatimentDocuments', ['batiment_id', 'document_id'], {
      unique: true,
      name: 'batiment_document_composite_unique'
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('BatimentDocuments');
  }
};