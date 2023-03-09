const { Sequelize } = require("sequelize");
const { dbSequelize } = require("../config/db");
const { DataTypes } = Sequelize;

const UsersModel = dbSequelize.define(
  "users",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    gender: {
      type: DataTypes.STRING,
    },
    birthdate: {
      type: DataTypes.STRING,
    },
    picture: {
      type: DataTypes.STRING,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    retryOtp: {
      type: DataTypes.INTEGER,
    },
    lastOtpTime: {
      type: DataTypes.INTEGER,
    },
    isTenant: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    phone: {
      type: DataTypes.STRING,
    },
    cardPicture: {
      type: DataTypes.STRING,
    },
    cardNumber: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = UsersModel;
