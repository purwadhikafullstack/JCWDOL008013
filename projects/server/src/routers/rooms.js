const express = require("express");
const route = express.Router();
const { roomsController } = require("../controllers");

route.get("/", roomsController.getRoomsData);

module.exports = route