const { Sequelize } = require("sequelize");

const dbSequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    port: process.env.DB_PORT || 3306
  }
);

const checkSequelize = async () => {
  try {
    await dbSequelize.authenticate();
    console.log("Sequelize Connection Success ✅");
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  dbSequelize,
  checkSequelize,
};
