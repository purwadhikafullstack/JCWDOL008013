const express = require("express");
const route = express.Router();
const { specialPricesController } = require("../controllers");

route.get("/", specialPricesController.getSpecialPricesData);
route.post("/setprice", specialPricesController.setPrice);
route.get("/getspecialprice", specialPricesController.getSpecialPrice);
route.patch("/editspecialprice", specialPricesController.editSpecialPrice);
route.post("/deletespecialprice", specialPricesController.deleteSpecialPrice);

module.exports = route;
