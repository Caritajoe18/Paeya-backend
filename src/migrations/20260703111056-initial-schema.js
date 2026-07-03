'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      email: { type: Sequelize.STRING, allowNull: false, unique: true },
      password: { type: Sequelize.STRING, allowNull: false },
      name: { type: Sequelize.STRING, allowNull: false },
      role: { type: Sequelize.ENUM('admin', 'viewer'), defaultValue: 'admin' },
      isActive: { type: Sequelize.BOOLEAN, defaultValue: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.createTable('Products', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      description: { type: Sequelize.TEXT },
      price: { type: Sequelize.DECIMAL(15, 2), allowNull: false },
      currency: { type: Sequelize.STRING(3), defaultValue: 'NGN' },
      isActive: { type: Sequelize.BOOLEAN, defaultValue: true },
      metadata: { type: Sequelize.JSONB, defaultValue: {} },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

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

    await queryInterface.createTable('WebhookEvents', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      eventType: { type: Sequelize.STRING, allowNull: false },
      nombaReference: { type: Sequelize.STRING },
      status: {
        type: Sequelize.ENUM('received', 'processed', 'failed'),
        defaultValue: 'received',
      },
      rawPayload: { type: Sequelize.JSONB, allowNull: false },
      processedAt: { type: Sequelize.DATE },
      error: { type: Sequelize.TEXT },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('WebhookEvents');
    await queryInterface.dropTable('Transactions');
    await queryInterface.dropTable('Staff');
    await queryInterface.dropTable('Products');
    await queryInterface.dropTable('Users');
  },
};
