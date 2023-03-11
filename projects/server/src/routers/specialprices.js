const express = require("express");
const route = express.Router();
const { specialPricesController } = require("../controllers");

route.get("/", specialPricesController.getSpecialPricesData);

module.exports = route;
