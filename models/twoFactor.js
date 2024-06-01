'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TwoFactor extends Model {
    static associate(models) {
      TwoFactor.belongsTo(models.Profile, { foreignKey: 'profileId' });
    }
  }

  TwoFactor.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    profileId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    twoFactorSecret: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    twoFactorEnabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
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
    modelName: 'TwoFactor',
  });

  return TwoFactor;
};
