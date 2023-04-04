const express = require("express");
const { readToken } = require("../config/encript");
const route = express.Router();
const { ordersController } = require("../controllers");

route.get("/", ordersController.getOrdersData);
route.get("/detail",readToken, ordersController.getDetail);
// report
route.get("/report",readToken, ordersController.getReportData);

//order
route.post("/", ordersController.createUpdateOrders);
route.post("/review",readToken, ordersController.createUpdateOrders);
route.post("/reject",readToken, ordersController.createUpdateOrders);
route.post("/confirm",readToken, ordersController.createUpdateOrders);
route.get("/available", ordersController.getAvailable);



module.exports = route