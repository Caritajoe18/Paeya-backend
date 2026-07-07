'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, _Sequelize) {
    const categoryIds = {
      electronics: 'a1b2c3d4-1111-4000-8000-000000000001',
      fashion: 'a1b2c3d4-2222-4000-8000-000000000002',
      home: 'a1b2c3d4-3333-4000-8000-000000000003',
      beauty: 'a1b2c3d4-4444-4000-8000-000000000004',
      sports: 'a1b2c3d4-5555-4000-8000-000000000005',
    };

    await queryInterface.bulkInsert('Categories', [
      { id: categoryIds.electronics, name: 'Electronics', createdAt: new Date(), updatedAt: new Date() },
      { id: categoryIds.fashion, name: 'Fashion', createdAt: new Date(), updatedAt: new Date() },
      { id: categoryIds.home, name: 'Home & Living', createdAt: new Date(), updatedAt: new Date() },
      { id: categoryIds.beauty, name: 'Beauty & Health', createdAt: new Date(), updatedAt: new Date() },
      { id: categoryIds.sports, name: 'Sports & Outdoors', createdAt: new Date(), updatedAt: new Date() },
    ]);

    const products = [
      {
        id: 'b1b2c3d4-1111-4000-8000-000000000001',
        name: 'WH-1000XM5',
        brand: 'Sony',
        price: 349.00,
        categoryId: categoryIds.electronics,
        photo: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop&auto=format',
        description: 'Industry-leading noise cancellation. 30-hour battery life.',
        stock: 14,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'b1b2c3d4-2222-4000-8000-000000000002',
        name: 'AirPods Pro 2',
        brand: 'Apple',
        price: 249.00,
        categoryId: categoryIds.electronics,
        photo: 'https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=600&h=600&fit=crop&auto=format',
        description: 'Adaptive audio. Active Noise Cancellation. Personalized Spatial Audio.',
        stock: 28,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'b1b2c3d4-3333-4000-8000-000000000003',
        name: 'MacBook Air M3',
        brand: 'Apple',
        price: 1099.00,
        categoryId: categoryIds.electronics,
        photo: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop&auto=format',
        description: '15-inch Liquid Retina display. 18-hour battery life. Supercharged by M3.',
        stock: 7,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'b1b2c3d4-4444-4000-8000-000000000004',
        name: 'Classic Leather Jacket',
        brand: 'Zara',
        price: 189.00,
        categoryId: categoryIds.fashion,
        photo: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=600&fit=crop&auto=format',
        description: 'Genuine leather. Slim fit. Zip-front closure.',
        stock: 22,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'b1b2c3d4-5555-4000-8000-000000000005',
        name: 'Running Sneakers Ultraboost',
        brand: 'Adidas',
        price: 179.00,
        categoryId: categoryIds.sports,
        photo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop&auto=format',
        description: 'Primeknit upper. Boost midsole. Energy-returning comfort.',
        stock: 35,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'b1b2c3d4-6666-4000-8000-000000000006',
        name: 'Smart LED Desk Lamp',
        brand: 'Xiaomi',
        price: 59.99,
        categoryId: categoryIds.home,
        photo: 'https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=600&h=600&fit=crop&auto=format',
        description: 'Adjustable color temperature. Wireless charging base. Eye-care tech.',
        stock: 42,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'b1b2c3d4-7777-4000-8000-000000000007',
        name: 'Vitamin C Serum',
        brand: 'The Ordinary',
        price: 24.99,
        categoryId: categoryIds.beauty,
        photo: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=600&fit=crop&auto=format',
        description: '23% Vitamin C + HA Spheres. Brightening. Anti-aging formula.',
        stock: 60,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'b1b2c3d4-8888-4000-8000-000000000008',
        name: 'Yoga Mat Premium',
        brand: 'Liforme',
        price: 129.99,
        categoryId: categoryIds.sports,
        photo: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&h=600&fit=crop&auto=format',
        description: 'Eco-friendly TPE. Alignment guides. Non-slip surface. 6mm thick.',
        stock: 18,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert('Products', products);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Products', null, {});
    await queryInterface.bulkDelete('Categories', null, {});
  },
};
