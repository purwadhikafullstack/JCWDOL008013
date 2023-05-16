const express = require("express");
const { readToken } = require("../config/encript");
const route = express.Router();
const { ordersController } = require("../controllers");
const {uploader} = require('../config/uploader')

route.get("/all", readToken,ordersController.getOrdersDataAll);
route.get("/",readToken, ordersController.getOrdersData);

route.get('/property',readToken, ordersController.getPropertyData)
route.get('/room',readToken, ordersController.getRoomData)
route.post('/create',readToken, ordersController.createOrder)
route.patch('/paymentproof',uploader('/paymentProof','PAYMENT').single('paymentProof'), ordersController.paymentProof)
route.patch('/cancel', ordersController.cancelOrder)

route.get("/detail",readToken, ordersController.getDetail);
// report
route.get("/report",readToken, ordersController.getReportData);

//order
// route.post("/",readToken, ordersController.createUpdateOrders);
route.post("/review",readToken, ordersController.createUpdateOrders);
route.post("/reject",readToken, ordersController.createUpdateOrders);
route.post("/confirm",readToken, ordersController.createUpdateOrders);
route.get("/availableroom", ordersController.getAvailableRoom);
route.get("/availableproperty", ordersController.getAvailableProperty);

route.get("/totalprice", ordersController.getPrice);
route.get("/getPriceCalendarBydate", ordersController.getPriceCalendarBydate);
route.get("/sendOrderMail",readToken, ordersController.sendOrderMail);
route.get("/getListReview",readToken, ordersController.getListReview);


module.exports = route