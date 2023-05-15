const express = require("express");
const route = express.Router();
const { usersController } = require("../controllers");
const {checkUser, checkChangePass, checkCardNumber, checkEditProfile } = require('../config/validator')
const { readToken } = require("../config/encript");
const { uploader } = require("../config/uploader");

route.get("/", usersController.getUsersData);
route.post("/regis",checkUser, usersController.regis);
route.post("/login", usersController.login);
route.post("/keep", readToken, usersController.keepLogin);
route.patch("/profile", checkEditProfile, readToken, usersController.editProfile);
route.post(
  "/profilepicture",
  readToken,
  uploader("/imgProfile").single("profileImg"),
  usersController.profilePicture
);
route.patch('/verify', readToken,usersController.verifyAccount)
route.patch('/changepass',readToken,usersController.changePassword)
route.post('/tobetenant', readToken, uploader('/idCard').single('cardPicture'), usersController.tobeTenant)
route.get('/resetpass', usersController.resetpassword)
route.get('/profiledata', readToken, usersController.profileData)
route.post('/reverify', usersController.resendVerify)
module.exports = route;
