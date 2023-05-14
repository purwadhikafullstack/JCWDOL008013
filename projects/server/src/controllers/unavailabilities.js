const UnavailabilitiesModel = require("../model/unavailabilities");
const { dbSequelize } = require("../config/db");
const SpecialPricesModel = require("../model/specialprices");
const { Op } = require("sequelize");
const OrdersModel = require("../model/orders");

module.exports = {
  getUnavailabilitiesData: async (req, res) => {
    try {
      let data = await UnavailabilitiesModel.findAll();
      return res.status(200).send(data);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  unavailability: async (req, res) => {
    try {
      let { id_room, start_date, end_date } = req.body;

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
                [Op.between]: [start_date, end_date],
              },
            },
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

      //Check special price dates
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
                [Op.between]: [start_date, end_date],
              },
            },
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

      // Check orders dates
      // First check if the date you want to select exceeds the existing date
      let ordersDataCheck = await OrdersModel.findAll({
        where: {
          id_room,
          [Op.or]: [
            {
              checkin_date: {
                [Op.between]: [start_date, end_date],
              },
            },
            {
              checkout_date: {
                [Op.between]: [start_date, end_date],
              },
            },
          ],
        },
      });
      // Second check if the date you want to select is between the existing dates
      let ordersData = await OrdersModel.findAll({
        where: {
          id_room,
        },
      });
      let ordersDataCheck2 = ordersData.find(
        (val) =>
          val.checkin_date <= new Date(start_date) &&
          new Date(start_date) <= val.checkout_date &&
          val.checkin_date <= new Date(end_date) &&
          new Date(end_date) <= val.checkout_date
      )

      if (unavailableDataCheck.length > 0 || unavailableDataCheck2) {
        return res.status(200).send({
          success: false,
          message: "The dates has been assigned before",
        });
      } else if (specialPriceDataCheck.length > 0 || specialPriceDataCheck2) {
        return res.status(200).send({
          success: false,
          message: "The dates has been assigned with special price",
        });
      } else if (ordersDataCheck.length > 0 || ordersDataCheck2) {
        return res.status(200).send({
          success: false,
          message: "The room is already booked on the date you selected"
        })
      } else {
        let create = await UnavailabilitiesModel.create({
          id_room,
          start_date,
          end_date,
        });
        return res.status(200).send({
          success: true,
          message: "Unavailable Dates Has Been Set",
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  getUnavailability: async (req, res) => {
    try {
      let id_room = req.query.room;
      const page = parseInt(req.query.page) || 0;
      const limit = 5;
      const offset = limit * page;
      const sort = req.query.sort;
      const order = req.query.order;
      let allData = await UnavailabilitiesModel.findAll({
        attributes: [
          ["id_availability", "id"],
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
        ],
        where: {
          id_room,
        },
      });
      let limitData = await UnavailabilitiesModel.findAndCountAll({
        attributes: [
          ["id_availability", "id"],
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
  editUnavailability: async (req, res) => {
    try {
      let { id_availability, start_date, end_date } = req.body;
      let update = await UnavailabilitiesModel.update(
        {
          start_date,
          end_date,
        },
        {
          where: {
            id_availability,
          },
        }
      );
      return res.status(200).send({
        success: true,
        message: "Unavailable Dates Has Been Updated",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  deleteUnavailability: async (req, res) => {
    try {
      let { id_availability } = req.body;
      let destroy = await UnavailabilitiesModel.destroy({
        where: {
          id_availability,
        },
      });
      return res.status(200).send({
        success: true,
        message: "Unavailable Dates Has Been Deleted",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
};
