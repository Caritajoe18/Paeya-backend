import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Staff = sequelize.define('Staff', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, validate: { isEmail: true } },
  phone: { type: DataTypes.STRING },
  accountNumber: { type: DataTypes.STRING, allowNull: false },
  bankCode: { type: DataTypes.STRING, allowNull: false },
  bankName: { type: DataTypes.STRING },
  salary: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0 },
  currency: { type: DataTypes.STRING(3), defaultValue: 'NGN' },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  metadata: { type: DataTypes.JSONB, defaultValue: {} },
}, {
  tableName: 'Staff',
  timestamps: true,
});

export default Staff;
