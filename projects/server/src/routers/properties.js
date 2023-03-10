const express = require("express");
const route = express.Router();
const { propertiesController } = require("../controllers");

route.get("/", propertiesController.getPropertiesData);

module.exports = route