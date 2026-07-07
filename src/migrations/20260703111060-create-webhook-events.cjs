'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
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
  },
};
