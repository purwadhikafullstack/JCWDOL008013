const usersRouter = require("./users");
const propertiesRouter = require("./properties");
const roomsRouter = require("./rooms");
const citiesRouter = require("./cities");
const ordersRouter = require("./orders");
const specialPricesRouter = require("./specialprices");
const unavailabilitiesRouter = require("./unavailabilities");
const categoryRouter = require("./category");

module.exports = {
  usersRouter,
  propertiesRouter,
  roomsRouter,
  citiesRouter,
  ordersRouter,
  specialPricesRouter,
  unavailabilitiesRouter,
  categoryRouter
};
