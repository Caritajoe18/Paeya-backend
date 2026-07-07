'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Transactions', 'sessionId', {
      type: Sequelize.STRING,
      comment: 'Nomba sessionId for requery',
    });
    await queryInterface.addColumn('Transactions', 'nombaProcessedAt', {
      type: Sequelize.STRING,
      comment: 'RFC-3339 timestamp from Nomba',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Transactions', 'sessionId');
    await queryInterface.removeColumn('Transactions', 'nombaProcessedAt');
  },
};
