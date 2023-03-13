const { Sequelize } = require("sequelize");
const { dbSequelize } = require("../config/db");
const { DataTypes } = Sequelize;

const RoomsModel = dbSequelize.define(
  "rooms",
  {
    id_room: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_property: {
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    picture: {
      type: DataTypes.STRING,
    },
    basePrice: {
      type: DataTypes.DOUBLE,
    },
    status: {
      type: DataTypes.INTEGER,
    },
  }
);

module.exports = RoomsModel;
