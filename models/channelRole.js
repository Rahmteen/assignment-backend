'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ChannelRole extends Model {
    static associate(models) {
      ChannelRole.belongsTo(models.Profile, { foreignKey: 'userId' });
      ChannelRole.belongsTo(models.Channel, { foreignKey: 'channelId' });
    }
  }

  ChannelRole.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    channelId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('SUPERADMIN', 'HOST', 'ADMIN'),
      allowNull: false,
    },
    muted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    banned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    sequelize,
    modelName: 'ChannelRole',
  });

  return ChannelRole;
};
