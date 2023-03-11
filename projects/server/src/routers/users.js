const express = require("express");
const route = express.Router();
const { usersController } = require("../controllers");

route.get("/", usersController.getUsersData);
route.post("/regis", usersController.regis);
route.post("/login", usersController.login);
route.post("/keep", usersController.keepLogin);

module.exports = route;
