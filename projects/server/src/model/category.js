const { Sequelize } = require("sequelize");
const { dbSequelize } = require("../config/db");
const { DataTypes } = Sequelize;

const CategoryModel = dbSequelize.define(
    "categories",
    {
        id_category: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        id_property: {
            type: DataTypes.INTEGER,
        },
        fasilitas: {
            type: DataTypes.STRING,
        },
    }
);

module.exports = CategoryModel;
