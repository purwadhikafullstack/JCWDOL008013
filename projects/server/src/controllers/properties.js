const PropertiesModel = require("../model/properties");

module.exports = {
  getPropertiesData: async (req, res) => {
    try {
      let data = await PropertiesModel.findAll();
      return res.status(200).send(data);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
};
