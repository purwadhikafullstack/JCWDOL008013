const express = require("express");
const { readToken } = require("../config/encript");
const route = express.Router();
const { ordersController } = require("../controllers");

route.get("/", ordersController.getOrdersData);
route.post("/", ordersController.createUpdateOrders);
// report
route.get("/report",readToken, ordersController.getReportData);


module.exports = route