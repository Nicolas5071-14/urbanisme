'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Utilisateurs', 'role', {
      type: Sequelize.STRING,
      allowNull: false
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Utilisateurs', 'role', {
      type: Sequelize.ENUM('CITOYEN', 'AGENT', 'ADMIN'),
      allowNull: false
    });
  }
};
