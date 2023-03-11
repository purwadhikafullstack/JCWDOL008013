const CitiesModel = require("../model/cities");

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
};
