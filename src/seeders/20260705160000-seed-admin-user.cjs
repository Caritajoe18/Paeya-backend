'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface) {
    const hash = await bcrypt.hash('payer', 12);

    await queryInterface.bulkInsert('Users', [
      {
        id: '00000000-0000-4000-8000-000000000001',
        email: 'admin@example.com',
        password: hash,
        name: 'Admin',
        role: 'admin',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Users', { email: 'admin@example.com' });
  },
};
