const { Sequelize } = require("sequelize");
const { dbSequelize } = require("../config/db");
const { DataTypes } = Sequelize;
const CitiesModel = require("./cities");

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
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    createdBy: {
      type: DataTypes.INTEGER,
    },
  }
);

PropertiesModel.hasOne(CitiesModel, { foreignKey: "id_city", as: "city" });
PropertiesModel.belongsTo(CitiesModel, { foreignKey: "id_city" });

module.exports = PropertiesModel;
