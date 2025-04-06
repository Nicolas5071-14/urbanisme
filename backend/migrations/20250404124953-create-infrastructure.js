'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Infrastructures', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      type: {
        type: Sequelize.ENUM('ROUTE', 'CANALISATION', 'RESEAU_ELECTRIQUE')
      },
      etat: {
        type: Sequelize.ENUM(['FONCTIONNEL','EN_PANNE','EN_CONSTRUCTION','HORS_SERVICE']),
        defaultValue: 'FONCTIONNEL'
      },
      geometrie: {
        type: Sequelize.GEOMETRY,
        allowNull: false
      },
      dateInstallation: {
        type: Sequelize.DATE
      },
      zoneUrbaine_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'ZoneUrbaines',  // Nom de la table cible
          key: 'id'
        },
        onUpdate: 'CASCADE',
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
    await queryInterface.dropTable('Infrastructures');
  }
};