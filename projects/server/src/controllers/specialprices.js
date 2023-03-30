const SpecialPricesModel = require("../model/specialprices");

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
  }
};
