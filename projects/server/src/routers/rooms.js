const express = require("express");
const route = express.Router();
const { roomsController } = require("../controllers");
const { uploader } = require("../config/uploader");

route.get("/", roomsController.getRoomsData);
route.post("/addroom", uploader("/imgRoom").single("roomImg"), roomsController.addRoom)
route.get("/getroom", roomsController.getRoom)
route.post("/editroom", uploader("/imgRoom").single("roomImg"), roomsController.editRoom)
route.patch("/deleteroom", roomsController.deleteRoom)
route.get("/detail", roomsController.getDetail)

module.exports = route