const { Sequelize } = require("sequelize");
const { dbSequelize } = require("../config/db");
const { DataTypes } = Sequelize;

const OrdersModel = dbSequelize.define(
  "orders",
  {
    id_order: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    no_invoice: {
      type: DataTypes.STRING,
    },
    id_property: {
      type: DataTypes.INTEGER,
    },
    id_room: {
      type: DataTypes.INTEGER,
    },
    checkin_date: {
      type: DataTypes.DATE,
    },
    checkout_date: {
      type: DataTypes.DATE,
    },
    order_status: {
      type: DataTypes.STRING,
    },
    total: {
      type: DataTypes.DOUBLE,
    },
    rating: {
      type: DataTypes.STRING,
    },
    comment: {
      type: DataTypes.STRING,
    },
    payment_proof: {
      type: DataTypes.STRING,
    },
    createdBy: {
      type: DataTypes.INTEGER,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = OrdersModel
