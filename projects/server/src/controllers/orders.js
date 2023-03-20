const OrdersModel = require("../model/orders");
const { Op } = require("sequelize");
const PropertiesModel = require("../model/properties");
const RoomsModel = require("../model/rooms");
const UsersModel = require("../model/users");

module.exports = {
  getOrdersData: async (req, res) => {
    try {
      let offset = 0, limit = 10, filter , status ,filterQuery = {}, orderQuery = [],statusQuery = {};
      
      if(req.query.limit && req.query.offset){
          limit = req.query.limit
          offset = (req.query.offset-1)* req.query.limit
      }
      
      if(req.query.ordercolumn && req.query.orderpos){
        orderQuery = [[req.query.ordercolumn,req.query.orderpos]]
      }

      if(req.query.status){
        status = req.query.status
        statusQuery = {
            order_status: { [Op.eq]:status },          
        }
      }
      
      if(req.query.filter){
          filter = req.query.filter
          filterQuery = {
            [Op.or]:{
                no_invoice: { [Op.like]: '%' + filter + '%' },
                total: { [Op.eq]: +filter },
            }
          }
      }

      const { count, rows } = await OrdersModel.findAndCountAll({
          offset: +offset, 
          limit: +limit,
          where: {[Op.and]:[statusQuery,filterQuery]},
          order: orderQuery,
          include:[
            {model: PropertiesModel},
            {model: RoomsModel},
            {model: UsersModel},
          ]
      })

      let compiled = {
          total : count,
          page : +offset+1,
          perpage : +limit,
          data : rows
      }
      
      return res.status(200).send({
        success: true,
        data:compiled,
        message: `Order Data Received`,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        success: false,
        message: "Something gone wrong",
        logs:error
      });
    }
  },
  createUpdateOrders: async(req, res)=>{
    try {
      let message = ""
      if(req.path === "/post"){
          let data = await OrdersModel.upsert()
          message = "Order Created";
      }else if(req.path === "/pay"){
          message = "Order Paid";
      }else if(req.path === "/confirm"){
          message = "Order Confirmed";
      }else if(req.path === "/review"){
          message = "Order Review Success";
      }
      
      return res.status(201).send({
        success: true,
        data:data,
        message: message,
      })
    } catch (error) {
      return res.status(500).send({
          success: false,
          message: "Your Password is Wrong",
          logs:error
      });
    }
  },
  
};
