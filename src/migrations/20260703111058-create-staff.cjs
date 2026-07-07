'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Staff', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING },
      phone: { type: Sequelize.STRING },
      accountNumber: { type: Sequelize.STRING, allowNull: false },
      bankCode: { type: Sequelize.STRING, allowNull: false },
      bankName: { type: Sequelize.STRING },
      salary: { type: Sequelize.DECIMAL(15, 2), defaultValue: 0 },
      currency: { type: Sequelize.STRING(3), defaultValue: 'NGN' },
      isActive: { type: Sequelize.BOOLEAN, defaultValue: true },
      metadata: { type: Sequelize.JSONB, defaultValue: {} },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Staff');
  },
};
