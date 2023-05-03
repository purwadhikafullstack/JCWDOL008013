const UnavailabilitiesModel = require("../model/unavailabilities");
const { dbSequelize } = require("../config/db");

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
      let create = await UnavailabilitiesModel.create({
        id_room,
        start_date,
        end_date,
      });
      res.status(200).send({
        success: true,
        message: "Unavailable Dates Has Been Set",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
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
      res.status(500).send(error);
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
