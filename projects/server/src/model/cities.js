const { Sequelize } = require("sequelize");
const { dbSequelize } = require("../config/db");
const { DataTypes } = Sequelize;

const CitiesModel = dbSequelize.define(
  "cities",
  {
    id_city: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    province: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = CitiesModel;
