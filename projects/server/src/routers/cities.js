const express = require("express");
const route = express.Router();
const { citiesController } = require("../controllers");

route.get("/", citiesController.getCitiesData);
route.get("/addcity", citiesController.addCitiesData);
route.get("/getprovince", citiesController.getProvince);
route.post("/getcity", citiesController.getCity);

module.exports = route
