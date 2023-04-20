const express = require("express");
const { readToken } = require("../config/encript");
const route = express.Router();
const { ordersController } = require("../controllers");
const {uploader} = require('../config/uploader')

route.get("/all", readToken,ordersController.getOrdersDataAll);
route.get("/", ordersController.getOrdersData);

route.get('/property',readToken, ordersController.getPropertyData)
route.get('/room',readToken, ordersController.getRoomData)
route.post('/create',readToken, ordersController.createOrder)
route.patch('/paymentproof',uploader('/paymentProof','PAYMENT').single('paymentProof'), ordersController.paymentProof)
route.patch('/cancel', ordersController.cancelOrder)

route.get("/detail",readToken, ordersController.getDetail);
// report
route.get("/report",readToken, ordersController.getReportData);

//order
route.post("/", ordersController.createUpdateOrders);
route.post("/review",readToken, ordersController.createUpdateOrders);
route.post("/reject",readToken, ordersController.createUpdateOrders);
route.post("/confirm",readToken, ordersController.createUpdateOrders);
route.get("/availableroom", ordersController.getAvailableRoom);
route.get("/availableproperty", ordersController.getAvailableProperty);

route.get("/totalprice", ordersController.getPrice);
route.get("/testing", ordersController.testing);


module.exports = route