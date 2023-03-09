const { Sequelize } = require("sequelize");

const dbSequelize = new Sequelize(
  process.env.DB_SCHEMA,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: "localhost",
    dialect: "mysql",
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
