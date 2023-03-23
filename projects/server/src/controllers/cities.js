const CitiesModel = require("../model/cities");
const request = require("request");

module.exports = {
  getCitiesData: async (req, res) => {
    try {
      let data = await CitiesModel.findAll();
      return res.status(200).send(data);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  addCitiesData: async (req, res) => {
    try {
      let options = {
        method: "GET",
        url: "https://api.rajaongkir.com/starter/city",
        headers: { key: "8211d4c3ba5d871f6f6918f8402a9bb9" },
      };

      request(options, function (error, response, body) {
        if (error) throw new Error(error);
        let data = JSON.parse(body).rajaongkir.results;
        let dataMap = data.map((value) => {
          return {
            name: value.type + " " + value.city_name,
            province: value.province,
          };
        });
        CitiesModel.bulkCreate(dataMap).then(() => {
          return res.status(200).send(dataMap);
        });
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  getProvince: async (req, res) => {
    try {
      let data = await CitiesModel.findAll({
        attributes: ["province"],
        group: ["province"],
        order: [["province", "ASC"]],
      });
      return res.status(200).send(data);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  getCity: async (req, res) => {
    try {
      let data = await CitiesModel.findAll({
        where: {
          province: req.body.province,
        },
      });
      return res.status(200).send(data);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
};
