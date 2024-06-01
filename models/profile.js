'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    static associate(models) {
      Profile.hasMany(models.Channel, { foreignKey: 'userId' });
      Profile.belongsToMany(models.Channel, { through: models.ChannelRole, foreignKey: 'userId' });
      Profile.hasMany(models.Follow, { as: 'Followers', foreignKey: 'followingId' });
      Profile.hasMany(models.Follow, { as: 'Following', foreignKey: 'followerId' });
      Profile.hasOne(models.Notification, { foreignKey: 'profileId' });
      Profile.hasOne(models.TwoFactor, { foreignKey: 'profileId' });
      Profile.hasMany(models.Chat, { foreignKey: 'profileId' });
    }
  }

  Profile.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    avatar: DataTypes.STRING,
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
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
    modelName: 'Profile',
  });

  return Profile;
};
