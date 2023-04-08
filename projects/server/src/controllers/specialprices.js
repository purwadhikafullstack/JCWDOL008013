const SpecialPricesModel = require("../model/specialprices");
const { dbSequelize } = require("../config/db");

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
  createOrUpdateSpeciaPrice:async(req,res)=>{
    try {
      let data = await SpecialPricesModel.upsert();
      return res.status(200).send(data)
    } catch (error) {
        return res.status(500).send(error)
    }
  },
  removeSpecialPrice: async(req,res) =>{
    try {
      let data = await SpecialPricesModel.destroy({
          where: {
              // criteria
          }
      })
      return res.status(200).send(data)
    } catch (error) {
        return res.status(500).send(error)
    }
  },
  setPrice: async (req, res) => {
    try {
      let { id_room, start_date, end_date, nominal, percent } = req.body;
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
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  getSpecialPrice: async (req, res) => {
    try {
      let id_room = req.query.room;
      let data = await SpecialPricesModel.findAll({
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
      let dataMap = data.map((value) => ({
        ...value.dataValues,
        title: "Special Price",
      }));
      return res.status(200).send(dataMap);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
};
