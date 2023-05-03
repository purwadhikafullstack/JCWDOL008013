const express = require("express");
const route = express.Router();
const { roomsController } = require("../controllers");
const { uploader } = require("../config/uploader");

route.get("/", roomsController.getRoomsData);
route.post("/addroom", uploader("/imgRoom", "IMGROOM").array("images", 1), roomsController.addRoom)
route.get("/getroom", roomsController.getRoom)
route.patch("/editroom", uploader("/imgRoom", "IMGROOM").array("images", 1), roomsController.editRoom)
route.patch("/deleteroom", roomsController.deleteRoom)
route.get("/detail", roomsController.getDetail)

module.exports = route