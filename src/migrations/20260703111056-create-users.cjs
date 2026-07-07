'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
         type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      email: { 
        type: Sequelize.STRING, allowNull: false, unique: true },
      password: {
         type: Sequelize.STRING, allowNull: false },
      name: {
         type: Sequelize.STRING, allowNull: false },
      role: {
         type: Sequelize.ENUM('admin', 'viewer'), defaultValue: 'admin' },
      isActive: {
         type: Sequelize.BOOLEAN, defaultValue: true },
      createdAt: {
         type: Sequelize.DATE, allowNull: false },
      updatedAt: { 
        type: Sequelize.DATE, allowNull: false },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Users');
  },
};
