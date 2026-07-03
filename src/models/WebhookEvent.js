import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const WebhookEvent = sequelize.define('WebhookEvent', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  eventType: { type: DataTypes.STRING, allowNull: false },
  nombaReference: { type: DataTypes.STRING },
  status: { type: DataTypes.ENUM('received', 'processed', 'failed'), defaultValue: 'received' },
  rawPayload: { type: DataTypes.JSONB, allowNull: false },
  processedAt: { type: DataTypes.DATE },
  error: { type: DataTypes.TEXT },
});

export default WebhookEvent;
