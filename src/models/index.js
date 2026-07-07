import User from './User.js';
import Product from './Product.js';
import Category from './Category.js';
import Staff from './Staff.js';
import Transaction from './Transaction.js';
import WebhookEvent from './WebhookEvent.js';

const initializeModels = () => {
  const models = {
    User,
    Product,
    Category,
    Staff,
    Transaction,
    WebhookEvent,
  };

  Object.values(models).forEach((model) => {
    if (typeof model.associate === 'function') {
      model.associate(models);
    }
  });

  return models;
};

export default initializeModels;
