import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'

const Prediction = sequelize.define('Prediction', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  image_path: {
    type: DataTypes.STRING,
    allowNull: false
  },
  predicted_class: {
    type: DataTypes.STRING,
    allowNull: false
  },
  confidence: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  all_predictions: {
    type: DataTypes.JSON,
    allowNull: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users', // <--- SỬA LẠI CHỖ NÀY: Phải là 'users' (viết thường)
      key: 'id'
    }
  }
}, {
  tableName: 'predictions', // Đã đúng
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
})

export default Prediction
