const { Sequelize } = require("sequelize");
const { dbSequelize } = require("../config/db");
const { DataTypes } = Sequelize;

const SpecialPricesModel = dbSequelize.define(
  "special_price",
  {
    id_special_price: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_room: {
      type: DataTypes.INTEGER,
    },
    start_date: {
      type: DataTypes.DATE,
    },
    end_date: {
      type: DataTypes.DATE,
    },
    nominal: {
      type: DataTypes.DOUBLE,
    },
    percent: {
      type: DataTypes.INTEGER,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = SpecialPricesModel;
