const express = require("express");
const route = express.Router();
const { propertiesController } = require("../controllers");
const { readToken } = require("../config/encript");
const { uploader } = require("../config/uploader");

route.get("/", propertiesController.getPropertiesData);
route.post("/addproperty", readToken, uploader("/imgProperty", "IMGPROPERTY").array("images", 1), propertiesController.addProperty);
route.get("/getproperty", readToken, propertiesController.getProperty);
route.get("/getpropertydetail", readToken, propertiesController.getPropertyDetail);
route.patch("/editproperty", uploader("/imgProperty", "IMGPROPERTY").array("images", 1), propertiesController.editProperty);
route.patch("/deleteproperty", propertiesController.deleteProperty);
route.get("/landingproperty", propertiesController.getLandingProperty);

module.exports = route