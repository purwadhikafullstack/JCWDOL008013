const express = require("express");
const route = express.Router();
const { unavailabilitiesController } = require("../controllers");

route.get("/", unavailabilitiesController.getUnavailabilitiesData);
route.post("/unavailability", unavailabilitiesController.unavailability);
route.get("/getunavailability", unavailabilitiesController.getUnavailability);
route.patch("/editunavailability", unavailabilitiesController.editUnavailability);
route.post("/deleteunavailability", unavailabilitiesController.deleteUnavailability);

module.exports = route;
