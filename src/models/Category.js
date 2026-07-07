import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Category = sequelize.define('Category', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
});

Category.associate = (models) => {
  Category.hasMany(models.Product, { foreignKey: 'categoryId' });
};

export default Category;
