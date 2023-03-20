const express = require("express");
const route = express.Router();
const { ordersController } = require("../controllers");

route.get("/", ordersController.getOrdersData);
route.post("/", ordersController.createUpdateOrders);


module.exports = route