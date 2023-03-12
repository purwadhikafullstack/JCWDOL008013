const { Sequelize } = require("sequelize");
const { dbSequelize } = require("../config/db");
const { DataTypes } = Sequelize;

const PropertiesModel = dbSequelize.define(
  "properties",
  {
    id_property: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.STRING,
    },
    id_city: {
      type: DataTypes.INTEGER,
    },
    picture: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    rules: {
      type: DataTypes.STRING,
    },
    createdBy: {
      type: DataTypes.INTEGER,
    },
  }
);

module.exports = PropertiesModel;
