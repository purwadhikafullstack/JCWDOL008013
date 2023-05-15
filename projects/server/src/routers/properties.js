const express = require("express");
const route = express.Router();
const { propertiesController } = require("../controllers");
const { readToken } = require("../config/encript");
const { uploader } = require("../config/uploader");

route.get("/", propertiesController.getPropertiesData);
route.post("/addproperty", readToken, uploader("/imgProperty").single("propertyImg"), propertiesController.addProperty);
route.get("/getproperty", readToken, propertiesController.getProperty);
route.get("/getpropertydetail", readToken, propertiesController.getPropertyDetail);
route.post("/editproperty", uploader("/imgProperty").single("propertyImg"), propertiesController.editProperty);
route.patch("/deleteproperty", propertiesController.deleteProperty);
route.get("/landingproperty", propertiesController.getLandingProperty);

module.exports = route