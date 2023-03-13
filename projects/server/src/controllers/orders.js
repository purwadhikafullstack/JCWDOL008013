const OrdersModel = require("../model/orders");

module.exports = {
  getOrdersData: async (req, res) => {
    try {
      let data = await OrdersModel.findAll();
      return res.status(200).send(data);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  createUpdateOrders: async(req, res)=>{
    try {
      let data = await OrdersModel.upsert()
      return res.status(200).send(data)
    } catch (error) {
        return res.status(500).send(error)
    }
  },
  
};
