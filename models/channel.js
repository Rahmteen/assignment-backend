'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Channel extends Model {
    static associate(models) {
      Channel.belongsTo(models.Profile, { foreignKey: 'userId', as: 'Host' });
      Channel.belongsToMany(models.Profile, { through: models.ChannelRole, foreignKey: 'channelId' });
      Channel.hasMany(models.Chat, { foreignKey: 'channelId' });  
    }
  }

  Channel.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    live: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    suspended: {
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
    modelName: 'Channel',
  });

  return Channel;
};
