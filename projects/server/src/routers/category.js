const express = require("express");
const route = express.Router();
const { categoryController } = require("../controllers");

route.get("/", categoryController.getCategoryData);
route.post("/post", categoryController.createUpdateCategory);
route.delete("/delete", categoryController.removeCategory);

module.exports = route