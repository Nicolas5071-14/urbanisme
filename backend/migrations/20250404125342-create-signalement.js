'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Signalements', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      dateSignalement: {
        type: Sequelize.DATE
      },
      type: {
        type: Sequelize.ENUM('CONSTRUCTION_ILLICITE', 'DEGRADATION')
      },
      description: {
        type: Sequelize.TEXT
      },
      statut: {
        type: Sequelize.ENUM('NOUVEAU', 'EN_COURS', 'RESOLU', 'REJETE'), // Exemple de valeurs
        defaultValue: 'NOUVEAU'
      },
      localisation: {
        type: Sequelize.GEOMETRY('POINT'), // Précision du type géométrique
        allowNull: false
      },
      photos: {
        type: Sequelize.ARRAY(Sequelize.TEXT), // Pour PostgreSQL
        defaultValue: []
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
     // Dans la migration
     await queryInterface.addIndex('Signalements', ['localisation'], {
      type: 'spatial',
      concurrently: true
    });
  },
  async down(queryInterface, Sequelize) {
   
    await queryInterface.dropTable('Signalements');
  }

};