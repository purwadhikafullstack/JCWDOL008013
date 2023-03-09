const express = require("express");
const route = express.Router();
const { ordersController } = require("../controllers");

route.get("/", ordersController.getOrdersData);

module.exports = route