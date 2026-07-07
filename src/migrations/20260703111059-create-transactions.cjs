'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Transactions', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      nombaReference: { type: Sequelize.STRING, unique: true },
      localReference: { type: Sequelize.STRING, unique: true, allowNull: false },
      type: {
        type: Sequelize.ENUM('payment', 'transfer', 'bill_payment', 'airtime', 'data', 'refund'),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('pending', 'success', 'failed', 'reversed'),
        defaultValue: 'pending',
      },
      amount: { type: Sequelize.DECIMAL(15, 2), allowNull: false },
      currency: { type: Sequelize.STRING(3), defaultValue: 'NGN' },
      fee: { type: Sequelize.DECIMAL(15, 2), defaultValue: 0 },
      customerEmail: { type: Sequelize.STRING },
      customerName: { type: Sequelize.STRING },
      recipientAccount: { type: Sequelize.STRING },
      recipientBank: { type: Sequelize.STRING },
      biller: { type: Sequelize.STRING },
      phone: { type: Sequelize.STRING },
      provider: { type: Sequelize.STRING },
      metadata: { type: Sequelize.JSONB, defaultValue: {} },
      nombaResponse: { type: Sequelize.JSONB },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Transactions');
  },
};
