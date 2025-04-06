'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ProjetUrbains', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nom: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          len: [3, 500]
        }
      },
      description: {
        type: Sequelize.TEXT
      },
      dateDebut: {
        type: Sequelize.DATEONLY,  // Stocke seulement la date sans heure
        allowNull: false
      },
      dateFin: {
        type: Sequelize.DATEONLY,
        validate: {
          isAfter: this.dateDebut  // Validation des dates cohérentes
        }
      },
      budget: {
        type: Sequelize.DECIMAL(12, 2),  // Meilleur que FLOAT pour les valeurs monétaires
        get() {
          return parseFloat(this.getDataValue('budget')) || 0;
        }
      },
      geometrie: {
        type: Sequelize.GEOMETRY('POLYGON'),  // Type explicite pour les projets urbains
        allowNull: false
      },
      statut: {
        type: Sequelize.ENUM('planification', 'en_cours', 'suspendu', 'acheve', 'abandonne'),
        defaultValue: 'planification'
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
    await queryInterface.addIndex('ProjetUrbains', ['geometrie'], {
      type: 'spatial',
      concurrently: true
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ProjetUrbains');
  }
};