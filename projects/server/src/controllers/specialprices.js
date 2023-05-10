const SpecialPricesModel = require("../model/specialprices");
const { dbSequelize } = require("../config/db");
const UnavailabilitiesModel = require("../model/unavailabilities");
const { Op } = require("sequelize");

module.exports = {
  getSpecialPricesData: async (req, res) => {
    try {
      let data = await SpecialPricesModel.findAll();
      return res.status(200).send(data);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  createOrUpdateSpeciaPrice: async (req, res) => {
    try {
      let data = await SpecialPricesModel.upsert();
      return res.status(200).send(data);
    } catch (error) {
      return res.status(500).send(error);
    }
  },
  removeSpecialPrice: async (req, res) => {
    try {
      let data = await SpecialPricesModel.destroy({
        where: {
          // criteria
        },
      });
      return res.status(200).send(data);
    } catch (error) {
      return res.status(500).send(error);
    }
  },
  setPrice: async (req, res) => {
    try {
      let { id_room, start_date, end_date, nominal, percent } = req.body;

      // Check special price dates
      // First check if the date you want to select exceeds the existing date
      let specialPriceDataCheck = await SpecialPricesModel.findAll({
        where: {
          id_room,
          [Op.or]: [
            {
              start_date: {
                [Op.between]: [start_date, end_date],
              },
            },
            {
              end_date: {
                [Op.between]: [start_date, end_date]
              }
            }
          ],
        },
      });
      // Second check if the date you want to select is between the existing dates
      let specialPriceData = await SpecialPricesModel.findAll({
        where: {
          id_room,
        },
      });
      let specialPriceDataCheck2 = specialPriceData.find(
        (val) =>
          val.start_date <= new Date(start_date) &&
          new Date(start_date) <= val.end_date &&
          val.start_date <= new Date(end_date) &&
          new Date(end_date) <= val.end_date
      );

      // Check unavailable dates
      // First check if the date you want to select exceeds the existing date
      let unavailableDataCheck = await UnavailabilitiesModel.findAll({
        where: {
          id_room,
          [Op.or]: [
            {
              start_date: {
                [Op.between]: [start_date, end_date],
              },
            },
            {
              end_date: {
                [Op.between]: [start_date, end_date]
              }
            }
          ],
        },
      });
      // Second check if the date you want to select is between the existing dates
      let unavailableData = await UnavailabilitiesModel.findAll({
        where: {
          id_room,
        },
      });
      let unavailableDataCheck2 = unavailableData.find(
        (val) =>
          val.start_date <= new Date(start_date) &&
          new Date(start_date) <= val.end_date &&
          val.start_date <= new Date(end_date) &&
          new Date(end_date) <= val.end_date
      );

      if (specialPriceDataCheck.length > 0 || specialPriceDataCheck2) {
        return res.status(200).send({
          success: false,
          message: "The dates has been assigned before",
        });
      } else if (unavailableDataCheck.length > 0 || unavailableDataCheck2) {
        return res.status(200).send({
          success: false,
          message: "The dates has been assigned with unavailable"
        })
      } else {
        let create = await SpecialPricesModel.create({
          id_room,
          start_date,
          end_date,
          nominal,
          percent,
        });
        return res.status(200).send({
          success: true,
          message: "Special Price Has Been Set",
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  getSpecialPrice: async (req, res) => {
    try {
      let id_room = req.query.room;
      const page = parseInt(req.query.page) || 0;
      const limit = 5;
      const offset = limit * page;
      const sort = req.query.sort;
      const order = req.query.order;
      let allData = await SpecialPricesModel.findAll({
        attributes: [
          ["id_special_price", "id"],
          [
            dbSequelize.fn(
              "DATE_FORMAT",
              dbSequelize.col("start_date"),
              "%Y-%m-%d"
            ),
            "start",
          ],
          [
            dbSequelize.fn(
              "DATE_FORMAT",
              dbSequelize.col("end_date"),
              "%Y-%m-%d"
            ),
            "end",
          ],
          "nominal",
          "percent",
        ],
        where: {
          id_room,
        },
      });
      let limitData = await SpecialPricesModel.findAndCountAll({
        attributes: [
          ["id_special_price", "id"],
          [
            dbSequelize.fn(
              "DATE_FORMAT",
              dbSequelize.col("start_date"),
              "%Y-%m-%d"
            ),
            "start",
          ],
          [
            dbSequelize.fn(
              "DATE_FORMAT",
              dbSequelize.col("end_date"),
              "%Y-%m-%d"
            ),
            "end",
          ],
          "nominal",
          "percent",
        ],
        where: {
          id_room,
        },
        limit,
        offset,
        order: [[sort, order]],
      });
      return res.status(200).send({
        allData: allData,
        limitData: limitData.rows,
        totalPage: Math.ceil(limitData.count / limit),
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  editSpecialPrice: async (req, res) => {
    try {
      console.log(req.body);
      let { id_special_price, start_date, end_date, nominal, percent } =
        req.body;
      let update = await SpecialPricesModel.update(
        {
          start_date,
          end_date,
          nominal,
          percent,
        },
        {
          where: {
            id_special_price,
          },
        }
      );
      return res.status(200).send({
        success: true,
        message: "Special Price Has Been Updated",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  deleteSpecialPrice: async (req, res) => {
    try {
      let { id_special_price } = req.body;
      let destroy = await SpecialPricesModel.destroy({
        where: {
          id_special_price,
        },
      });
      return res.status(200).send({
        success: true,
        message: "Special Price Has Been Deleted",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
};
