const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const FileStatus = sequelize.define('filestatus', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  rowsInserted: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  rowsUpdated: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  rowsSkipped: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  vendorName: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('onProgress', 'Success', 'Failed'),
    allowNull: false
  },
  time: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'filestatus',
  timestamps: false
});

module.exports = FileStatus;