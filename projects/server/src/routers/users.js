const express = require("express");
const route = express.Router();
const { usersController } = require("../controllers");

route.get("/", usersController.getUsersData);

module.exports = route