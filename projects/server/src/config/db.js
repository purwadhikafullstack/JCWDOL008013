// Sequelize configuration
const { Sequelize } = require("sequelize");
const mysql = require("mysql2");

const dbSequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",
    port: process.env.DB_PORT || 3306,
  }
);

// Connection check
const checkSequelize = async () => {
  try {
    await dbSequelize.authenticate();
    console.log("Sequelize connection success ✅");
  } catch (error) {
    console.log(error);
  }
};

const dbConf = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port:process.env.DB_PORT,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

module.exports = {
  dbSequelize,
  checkSequelize,
  dbConf,
};
