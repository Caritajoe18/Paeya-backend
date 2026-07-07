import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Transaction = sequelize.define('Transaction', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  nombaReference: { type: DataTypes.STRING, comment: 'Nomba transaction reference / orderReference' },
  localReference: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.ENUM('payment', 'transfer', 'bill_payment', 'airtime', 'data', 'refund'), allowNull: false },
  status: { type: DataTypes.ENUM('pending', 'success', 'failed', 'reversed'), defaultValue: 'pending' },
  amount: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
  currency: { type: DataTypes.STRING(3), defaultValue: 'NGN' },
  fee: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0 },
  customerEmail: { type: DataTypes.STRING },
  customerName: { type: DataTypes.STRING },
  recipientAccount: { type: DataTypes.STRING },
  recipientBank: { type: DataTypes.STRING },
  biller: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING },
  provider: { type: DataTypes.STRING },
  sessionId: { type: DataTypes.STRING, comment: 'Nomba sessionId for requery' },
  nombaProcessedAt: { type: DataTypes.STRING, comment: 'RFC-3339 timestamp from Nomba' },
  metadata: { type: DataTypes.JSONB, defaultValue: {} },
  nombaResponse: { type: DataTypes.JSONB, comment: 'Raw Nomba API response' },
});

export default Transaction;
