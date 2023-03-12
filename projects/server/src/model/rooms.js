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
  }
);

module.exports = RoomsModel;
