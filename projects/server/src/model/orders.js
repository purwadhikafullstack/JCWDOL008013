const { Sequelize } = require("sequelize");
const { dbSequelize } = require("../config/db");
const PropertiesModel = require("./properties");
const RoomsModel = require("./rooms");
const UsersModel = require("./users");
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
      references: {
          model: PropertiesModel,
          key: "id_property"
      }
    },
    id_room: {
      type: DataTypes.INTEGER,
      references: {
          model: RoomsModel,
          key: "id_room"
      }
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
      references: {
          model: UsersModel,
          key: "id_user"
      }
    },
  }
);

OrdersModel.belongsTo(PropertiesModel,{
  foreignKey:'id_property'
})

OrdersModel.belongsTo(RoomsModel,{
  foreignKey:'id_room'
})
OrdersModel.belongsTo(UsersModel,{
  foreignKey:'createdBy',
})
module.exports = OrdersModel
