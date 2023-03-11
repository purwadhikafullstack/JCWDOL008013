const express = require("express");
const route = express.Router();
const { citiesController } = require("../controllers");

route.get("/", citiesController.getCitiesData);

module.exports = route