const express = require("express");
const route = express.Router();
const { usersController } = require("../controllers");
const {checkUser, checkCardNumber} = require('../config/validator')
const { readToken } = require("../config/encript");
const { uploader } = require("../config/uploader");

route.get("/", usersController.getUsersData);
route.post("/regis",checkUser, usersController.regis);
route.post("/login", usersController.login);
route.post("/keep", readToken, usersController.keepLogin);
route.patch("/profile", readToken, usersController.editProfile);
route.patch(
  "/profilepicture",
  readToken,
  uploader("/imgProfile", "IMGPROFILE").array("images", 1),
  usersController.profilePicture
);
route.patch('/verify', readToken,usersController.verifyAccount)
route.patch('/changepass',readToken,usersController.changePassword)
module.exports = route;
