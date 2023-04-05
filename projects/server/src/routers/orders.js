const express = require("express");
const route = express.Router();
const { ordersController } = require("../controllers");
const {readToken} = require('../config/encript')
const {uploader} = require('../config/uploader')

route.get("/all", readToken,ordersController.getOrdersDataAll);
route.get("/", ordersController.getOrdersData);
route.get('/property',readToken, ordersController.getPropertyData)
route.get('/room',readToken, ordersController.getRoomData)
route.post('/create',readToken, ordersController.createOrder)
route.patch('/paymentproof',uploader('/paymentProof','PAYMENT').single('paymentProof'), ordersController.paymentProof)
route.patch('/cancel', ordersController.cancelOrder)

module.exports = route