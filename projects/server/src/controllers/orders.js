const OrdersModel = require("../model/orders");
const { Op, Sequelize, where } = require("sequelize");
const PropertiesModel = require("../model/properties");
const RoomsModel = require("../model/rooms");
const UsersModel = require("../model/users");
const CitiesModel = require("../model/cities");
const { dbSequelize } = require("../config/db");
const { dbConf } = require("../config/db");
const { generateInvoiceNumber } = require("../middleware/generate");
const schedule = require('node-schedule');
const { transport } = require("../config/nodemailer");
const SpecialPricesModel = require("../model/specialprices");

module.exports = {
  getOrdersDataAll: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 0;
      const limit = 5;
      const offset = limit * page;
      const status = req.query.status || "All Status";
      let sort, order;
      switch (req.query.sort) {
        case "Invoice Asc":
          sort = "no_invoice";
          order = "ASC";
          break;
        case "Invoice Des":
          sort = "no_invoice";
          order = "DESC";
          break;
        case "Date Asc":
          sort = "checkin_date";
          order = "ASC";
          break;
        case "Date Des":
          sort = "checkin_date";
          order = "DESC";
          break;
        default:
          sort = "checkin_date";
          order = "ASC";
          break;
      }
  
      const whereClause = {
        createdBy: req.decript.id_user,
      };
  
      if (status !== "All Status") {
        whereClause.order_status = status;
      }
  
      if (req.query.datefil === "range") {
        // Filter by date range
        if (req.query.startdate && req.query.enddate) {
          whereClause.checkin_date = {
            [Op.between]: [req.query.startdate, req.query.enddate],
          };
        } else {
          return res
            .status(400)
            .json({ message: "Please provide both startdate and enddate" });
        }
      } else if (req.query.datefil && req.query.datefil !== "All Date") {
        // Filter by date difference
        const today = new Date();
        const checkinDate = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() - parseInt(req.query.datefil)
        );
        whereClause.checkin_date = {
          [Op.between]: [checkinDate, today],
        };
      }
  
      if (req.query.search) {
        whereClause[Op.or] = [{
          no_invoice: {
            [Op.like]: `%${req.query.search}%`,
          },
        },
          {
            "$Property.name$": {
              [Op.like]: `%${req.query.search}%`,
            },
          },
          {
            "$Property.City.name$": {
              [Op.like]: `%${req.query.search}%`,
            },
          },
        ];
      }
  
      const orders = await OrdersModel.findAndCountAll({
        attributes: [
          "id_order",
          "no_invoice",
          "total",
          "order_status",
          "checkin_date",
          "checkout_date",
          "rating",
          "comment"
        ],
        include: [
          {
            model: PropertiesModel,
            attributes: ["name"],
            include: [
              {
                model: CitiesModel,
                attributes: ["name"],
              },
            ],
          },
        ],
        where: whereClause,
        limit,
        offset,
        order: [[sort, order]],
      });
      const totalPage = Math.ceil(orders.count / limit);
      res.json({ ...orders, totalPage });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  },
  getOrdersData: async (req, res) => {
    try {
      let offset = 0, limit = 10, filter , status ,filterQuery = {}, orderQuery = [],statusQuery = {};
      let id_tenant = req.decript.id_user
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
                total: { [Op.eq]: !isNaN(filter)?+filter:"" },
                "$property.name$" : {[Op.like]: '%' + filter + '%'  },
                "$user.username$" : {[Op.like]: '%' + filter + '%'  }
            }
          }
      }

      const { count, rows } = await OrdersModel.findAndCountAll({
          offset: +offset, 
          limit: +limit,
          where: {[Op.and]:[statusQuery,filterQuery,{'$property.createdBy$' : {[Op.eq]: id_tenant}}]},
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
  getReportData: async (req, res) => {
    try {
      let offset = 0, limit = 10, filterprop = {}, filteruser={} , filterQuery = {}, orderQuery = [],statusQuery = {}, betweenDate = {},id_tenant,selectuser,selectproperty;
      id_tenant = req.decript.id_user
      if(req.query.limit && req.query.offset){
          limit = req.query.limit
          offset = (req.query.offset-1)* req.query.limit
      }
      
      if(req.query.ordercolumn && req.query.orderpos){
        orderQuery = [[req.query.ordercolumn,req.query.orderpos]]
      }

      if(req.query.startdate && req.query.enddate ){
        let start = new Date(req.query.startdate)
        let end = new Date(req.query.enddate)
        betweenDate = {createdAt: {[Op.between]: [start.setDate(start.getDate()),end.setDate(end.getDate()+1)]}}
      }

      statusQuery = {
          order_status: { [Op.eq]:"CONFIRMED" },          
      }
      
      if(req.query.filterinvoice){
          filterQuery = {no_invoice:{[Op.like]:'%'+req.query.filterinvoice+'%'}}
      }

      if(req.query.filterprop){
          filterprop = {'$property.id_property$' : {[Op.eq]: req.query.filterprop}}
      }

      if(req.query.filteruser){
          filteruser = {createdBy:{[Op.eq]:req.query.filteruser}}
      }

      const { count, rows } = await OrdersModel.findAndCountAll({
          offset: +offset, 
          limit: +limit,
          where: {[Op.and]:[
            statusQuery,
            filterQuery,
            betweenDate,
            filterprop,
            filteruser,
            {'$property.createdBy$' : {[Op.eq]: id_tenant}}
          ]},
          order: orderQuery,
          include:[
            {model: PropertiesModel},
            {model: RoomsModel},
            {model: UsersModel},
          ]
      })

      let totalamount = 0
      rows.map(x=>totalamount+=x.total)
      let compiled = {
          total : count,
          page : +offset+1,
          perpage : +limit,
          data : rows
      }

      selectproperty = await PropertiesModel.findAll({
          attributes:['id_property','name'],
          where:{[Op.and]:[
              {createdBy: {[Op.eq]:id_tenant}},
              {status:{[Op.eq]:1}}
          ]}
      })

      selectuser = await UsersModel.findAll({
        attributes:['id_user','username']
      })
      
      return res.status(200).send({
          success: true,
          data:compiled,
          selectproperty,
          selectuser,
          totalamount,
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
      let data = null
      propertyData = null
      if(req.path === "/post"){
          // let data = await OrdersModel.upsert()
          message = "Order Created";
      }else if(req.path === "/confirm"){
          const {id_order,order_status} = req.body
          if(order_status == "CONFIRMED"){
              data = await OrdersModel.upsert({
                  id_order: id_order,
                  order_status:order_status
              })    
              message = "Order Confirmed";
              // send email
              propertyData = await OrdersModel.findOne({
                where:{id_order:id_order},
                include:[
                  {model: PropertiesModel},
                  {model: RoomsModel},
                  {model: UsersModel},

                ]
              })
              if(propertyData){
                  let tanggal =  new Date(propertyData.checkout_date)
                  tanggal.setDate(tanggal.getDate()-2)
                  // let tanggal = new Date()
                  tanggal.setHours(0,0,0)
                  // console.log(tanggal.toDateString(),tanggal.toTimeString())
                  const job = schedule.scheduleJob(tanggal, function(){
                      transport.sendMail(
                          {
                            from: "StayComfy",
                            to: propertyData.user.email,
                            subject: "Reminder Rules of Property Ordered on StayComfy",
                            html: `<div>
                              <p>Dear ${propertyData.user.username},</p>
                              <p>We are thrilled to have you as our guest at our property. To ensure a pleasant and comfortable stay for everyone, we kindly ask you to abide by the following rules:</p>
                              ${propertyData.property.rules}
                              </br>
                              <p>We hope that these guidelines will help you have a pleasant stay at our property. Should you have any questions or concerns, please feel free to reach out to us.</p>
                              <p>Thank you for choosing our property as your accommodation.</p>
                              <p>Best regards,</p>
                              <p>Stay Comfy</p>
                          </div>`,
                          },
                          (err, info) => {
                            if (err) {
                              console.log(`error : ${err}`);
                            }
                            if(info) {
                              
                            }
                          }
                      );
                  });
              }
              
          }else if(order_status == "UNPAID"){
              data = await OrdersModel.upsert({
                  id_order: id_order,
                  order_status:order_status
              })  
              message = "Order Canceled";
          }else{
              message = "Order Tidak Bisa Diconfirm"
          }
          


      }else if(req.path === "/review"){
        const {id_order, rating, comment} = req.body
        let check = await OrdersModel.findOne({where:{[Op.and]:[
            {id_order:id_order},
            {order_status:"CONFIRMED"},
            {createdBy:req.decript.id_user}
        ]}})

        if(check && (check.rating == null && check.comment == null)){
          if( new Date (check.checkout_date).getTime() < new Date().getTime()){
              data = await OrdersModel.upsert({
                  id_order: id_order,
                  rating: rating,
                  comment: comment
              })    
              message = "Order Review Success";
          }else{
              message = "Belum Bisa Review"
          }
        }else{
            message = "Sudah Pernah Review"
        }
          
      }else if(req.path === "/reject"){
          const {id_order} = req.body
          
          let check = await OrdersModel.findOne({where:{id_order:id_order,order_status:"UNPAID"}})
          if(check){
            data = await OrdersModel.upsert({
                id_order : id_order,
                order_status : "CANCELED"
            })
            message = "Order Reject Success";
          }else{
            message = "Tidak Bisa Reject Order"
          }
      }
      
      return res.status(201).send({
        success: true,
        data:data,
        propertyData,
        message: message,
      })
    } catch (error) {
      console.log(error)
      return res.status(500).send({
          success: false,
          message: "Something Gone Wrong",
          logs:error
      });
    }
  },
  getDetail: async(req,res)=>{
    try{
        const {id_order} = req.query
        let check = await OrdersModel.findOne({where:{[Op.and]:[
            {id_order:id_order},
        ]},include:[
          {model: PropertiesModel,include:[{model:CitiesModel}]},
          {model: RoomsModel},
          {model: UsersModel},
        ]})
        data = check
        message = "Order Received";

        return res.status(200).send({
          success: true,
          data:data,
          message: message,
        })
      } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: "Something Gone Wrong",
            logs:error
        });
      }
  },
  getPrice: async(req,res)=>{
      try{
          let startDate = new Date(req.query.startDate)
          startDate.setDate(startDate.getDate()+1)
          let endDate = new Date(req.query.endDate)
          startDate.setDate(startDate.getDate()-1)
          let idRoom = req.query.idRoom 
          let data = []
          let getBasePrice = await RoomsModel.findOne({attributes:['basePrice'],where:{id_room:idRoom}})
          let basePrice = +getBasePrice.basePrice || 0
          let total = 0
          for(var d = startDate; d<endDate; d.setDate(d.getDate()+1)){
              let querydate= d.toLocaleString().slice(0, 19).replace("T", " ")
              
              let special = await SpecialPricesModel.findOne(
                {where:{[Op.and]:[
                  {id_room:idRoom},
                  {[Op.or]:[
                    {start_date:{[Op.between]:[querydate,querydate]}},
                    {end_date:{[Op.between]:[querydate,querydate]}},
                    {[Op.and]:[{start_date:{[Op.lte]:querydate},end_date:{[Op.gte]:querydate}}]}
                  ]}
                ]},order:[["id_special_price","desc"]]}
              )
              if(special){
                  if(special.nominal != null){
                      let price = +special.nominal
                      total+=price
                      data.push(d.getDate()+" : "+total)
                  }else if(special.percent != null){
                      let price = +special.percent
                      total+=basePrice+((basePrice/100)*price)
                      data.push(d.getDate()+" : "+total)
                  }else{
                      total+=basePrice
                      data.push(d.getDate()+" : "+total)
                  }
              }else{
                  total +=basePrice 
                  data.push(d.getDate()+" : "+total)
              }
              
          }

          return res.status(200).send({
              total:total,
              data,
              success: true,
          })
      }catch(error){
          console.log(error)
          return res.status(500).send({
              success: false,
              message: "Something Gone Wrong",
              logs:error
          });
      }
  },
  getAvailableProperty: async(req,res)=>{
    try{
      let startDate = new Date(req.query.startDate).toISOString().slice(0, 19).replace("T", " ") 
      let endDate = new Date(req.query.endDate).toISOString().slice(0, 19).replace("T", " ")
      let id_city = req.query.cityId
      

      const page = parseInt(req.query.page-1) || 0;
      const limit = parseInt(req.query.perpage) || 10;
      const offset = limit * page;
      const keyword = req.query.keyword || "";
      const sort = req.query.sort || "id_property";
      const order = req.query.order || "ASC";
      let arrOrder = [sort,order]
      if(sort === "basePrice"){
          arrOrder = [{model:RoomsModel,as:"listrooms"},sort, order]
      }

      // for proprety base price
      const { rows } = await PropertiesModel.findAndCountAll({
        include:[
          { model: CitiesModel,as: "city",required: true, },
          { model: RoomsModel, as: "listrooms",required: false, include:[{model:SpecialPricesModel, as:"sprice",required:false,where:{
            [Op.or]:[
              {start_date:{[Op.between]:[startDate,endDate]}},
              {end_date:{[Op.between]:[startDate,endDate]}},
              {[Op.and]:[{start_date:{[Op.lte]:startDate},end_date:{[Op.gte]:endDate}}]}
            ]
          }}]},
        ],
        limit,
        offset,        
        required: true,
        where: {
          id_city,
          status: 1,
          [Op.or]:[ 
            {
              name: {
                [Op.like]: "%" + keyword + "%",
              },
            },
            {
              address: {
                [Op.like]: "%" + keyword + "%",
              },
            },
          ], 
          id_property: {
              [Op.notIn]: Sequelize.literal(
                `(
                  SELECT orders.id_property
                  FROM orders
                  JOIN properties ON orders.id_property=properties.id_property
                  WHERE orders.order_status = "CONFIRMED" AND properties.id_city='${id_city}'
                  AND (
                        (orders.checkin_date BETWEEN '${startDate}' AND '${endDate}')
                        OR (orders.checkout_date BETWEEN '${startDate}' AND '${endDate}')
                        OR (orders.checkin_date <= '${startDate}'  AND orders.checkout_date >= '${endDate}') 
                  )  
                )`
              )
          }
        },
        order: [arrOrder],
        // order: [[{model:RoomsModel,as:"listrooms"},"basePrice", 'asc']],
      });
      const count = await PropertiesModel.findAll({
          include:[
            { model: CitiesModel,as: "city",required: true, },
            { model: RoomsModel, as: "listrooms",required: false, include:[{model:SpecialPricesModel, as:"sprice",required:false,where:{
              [Op.or]:[
                {start_date:{[Op.between]:[startDate,endDate]}},
                {end_date:{[Op.between]:[startDate,endDate]}},
                {[Op.and]:[{start_date:{[Op.lte]:startDate},end_date:{[Op.gte]:endDate}}]}
              ]
            }}]},
          ],  
          required: true,
          where: {
            id_city,
            status: 1,
            [Op.or]:[ 
              {
                name: {
                  [Op.like]: "%" + keyword + "%",
                },
              },
              {
                address: {
                  [Op.like]: "%" + keyword + "%",
                },
              },
            ], 
            id_property: {
                [Op.notIn]: Sequelize.literal(
                  `(
                    SELECT orders.id_property
                    FROM orders
                    JOIN properties ON orders.id_property=properties.id_property
                    WHERE orders.order_status = "CONFIRMED" AND properties.id_city='${id_city}'
                    AND (
                          (orders.checkin_date BETWEEN '${startDate}' AND '${endDate}')
                          OR (orders.checkout_date BETWEEN '${startDate}' AND '${endDate}')
                          OR (orders.checkin_date <= '${startDate}'  AND orders.checkout_date >= '${endDate}') 
                    )  
                  )`
                )
            }
          },
          order: [arrOrder],
          // order: [[{model:RoomsModel,as:"listrooms"},"basePrice", 'asc']],
      });

      let compiled = {
          total : count.length,
          page : +offset+1,
          perpage : +limit,
          data : rows
      }

      return res.status(200).send({
        success: true,
        data:compiled,
      })
    }catch(error){
        console.log(error)
        return res.status(500).send({
            success: false,
            message: "Something Gone Wrong",
            logs:error
      });
    }

  },
  getAvailableRoom: async(req,res)=>{
      // Query for available rooms
      try{
        let startDate = new Date(req.query.startDate).toISOString().slice(0, 19).replace("T", " ") 
        let endDate = new Date(req.query.endDate).toISOString().slice(0, 19).replace("T", " ")
        let id_property  = req.query.propertyId;

        // for rooms fix by base price
        const availableRooms = await RoomsModel.findAll({
          where: {[Op.and]:[
            {id_property:id_property},
            {id_room: {
                [Op.notIn]: Sequelize.literal(
                  `(
                    SELECT orders.id_room
                    FROM orders
                    JOIN properties ON orders.id_property=properties.id_property
                    WHERE orders.order_status = "CONFIRMED" AND properties.id_property='${id_property}'
                    AND (
                          (orders.checkin_date BETWEEN '${startDate}' AND '${endDate}')
                          OR (orders.checkout_date BETWEEN '${startDate}' AND '${endDate}')
                          OR (orders.checkin_date <= '${startDate}'  AND orders.checkout_date >= '${endDate}') 
                    )  
                  )`
                )
            }}
            ]
          },
          include:[
              {model:PropertiesModel},
              {model:SpecialPricesModel, as:"sprice",required:false,where:{
                [Op.or]:[
                  {start_date:{[Op.between]:[startDate,endDate]}},
                  {end_date:{[Op.between]:[startDate,endDate]}},
                  {[Op.and]:[{start_date:{[Op.lte]:startDate},end_date:{[Op.gte]:endDate}}]}
                ]
              }}
          ]
        });

        
        return res.status(200).send({
          data:availableRooms,
          success: true,
        })
      }catch(error){
          console.log(error)
          return res.status(500).send({
              success: false,
              message: "Something Gone Wrong",
              logs:error
          });
      }
      
  },
  getPropertyData: (req, res) => {
    const propertyId = req.query.propertyId;
    dbConf.query(
      `SELECT name, address, id_city, picture FROM properties WHERE id_property = ${dbConf.escape(
        propertyId
      )};`,
      (err, results) => {
        if (err) {
          return res
            .status(500)
            .send("Error getting property data from database");
        }
        const propertyData = results[0];
        // Get city data for the property
        const cityId = propertyData.id_city;
        dbConf.query(
          `SELECT name as city, province FROM cities WHERE id_city = ${dbConf.escape(
            cityId
          )};`,
          (err, resultsCity) => {
            if (err) {
              return res
                .status(500)
                .send("Error getting city data from database");
            }

            return res.send({
              ...propertyData,
              ...resultsCity[0],
            });
          }
        );
      }
    );
  },
  getRoomData: (req, res) => {
    const roomId = req.query.roomId;
    dbConf.query(
      `SELECT name as type FROM rooms WHERE id_room = ${dbConf.escape(
        roomId
      )};`,
      (err, results) => {
        if (err) {
          return res.status(500).send("Error getting room data from database");
        }
        const roomData = results[0];
        return res.status(200).send(roomData);
      }
    );
  },
  createOrder: (req, res) => {
    const { id_property, id_room, checkin_date, checkout_date, total } =
      req.body;
    const invoice_number = generateInvoiceNumber(4);

    dbConf.query(
      `INSERT INTO orders (id_property, id_room, checkin_date, checkout_date, total, createdBy, no_invoice, order_status, createdAt, updatedAt) 
      VALUES (${dbConf.escape(id_property)}, ${dbConf.escape(
        id_room
      )}, ${dbConf.escape(checkin_date)}, 
              ${dbConf.escape(checkout_date)}, ${dbConf.escape(
        total
      )}, ${dbConf.escape(req.decript.id_user)},
              ${dbConf.escape(invoice_number)}, "UNPAID", NOW(), NOW());
      `,
      (err, results) => {
        if (err) {
          console.log(err);
          return res.status(500).send("Error adding order data to database");
        }

        const orderData = {
          id_order: results.insertId,
          createdBy: req.decript.id_user,
          invoice_number: invoice_number,
        };

        return res.send(orderData);
      }
    );
  },
  paymentProof: (req, res) => {
    const currentTime = new Date();

    // bandingkan sudah  2 jam atau belum
    dbConf.query(
      `select createdAt from orders where id_order=${dbConf.escape(
        req.body.orderId
      )};`,
      (err, results) => {
        if (err) {
          return res.status(500).send({
            success: false,
            message: "tidak bisa ambil data createdAt",
          });
        }
        let createdAt = new Date(results[0].createdAt);
        createdAt.setHours(createdAt.getHours() + 7)
        const diffTime = Math.abs(currentTime - createdAt);
        const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
        if (diffHours >= 2) {
          // If more than 2 hours have passed, cancel the order
          dbConf.query(
            `update orders set order_status="CANCELED" where id_order=${dbConf.escape(
              req.body.orderId
            )};`,
            (err, results) => {
              if (err) {
                console.log(err);
                return res.status(500).send({
                  success: false,
                  message: "tidak bisa update order_status menjadi batal",
                });
              }
              return res.status(200).send({
                success: false,
                message:
                  "Order has been canceled because payment proof was not submitted within 2 hours.",
              });
            }
          );
        } else {
          // If less than 2 hours have passed, update the order with payment proof
          dbConf.query(
            `Update orders set payment_proof = ${dbConf.escape(
              `/paymentProof/${req.file.filename}`
            )}, order_status="PAID" where id_order=${dbConf.escape(
              req.body.orderId
            )};`,
            (err, results) => {
              if (err) {
                return res.status(500).send({
                  success: false,
                  message:
                    "tidak bisa update order status menjadi menunggu konfirmasi",
                });
              }
              return res.status(200).send({
                success: true,
                message: "We Have Received Your Payment",
              });
            }
          );
        }
      }
    );
  },
  cancelOrder: async (req, res) => {
    dbConf.query(`update orders set order_status="CANCELED" where id_order =${dbConf.escape(req.body.id_order)};`,
        (err, result) => {
          if (err) {
            console.log(err);
            return res.status(500).send(err);
          }
          return res.status(200).send({
            success: true,
            message: "Your Order Succesfully be Canceled",
          });
        }
      );
  },
  getPriceCalendarBydate:async(req,res)=>{
    try{
        let startDate = new Date(req.query.startDate)
        startDate.setDate(startDate.getDate()+1)
        let endDate = new Date(req.query.endDate)
        endDate.setDate(endDate.getDate()+1)

        let id_property = req.query.id_property
        let data = []

        let total = 0
        for(var d = startDate; d<= endDate; d.setDate(d.getDate()+1)){
            let querydate= d.toISOString().slice(0, 19).replace("T", " ")
            const availableRooms = await RoomsModel.findAll({
                where: {[Op.and]:[
                  {id_property:id_property},
                  {id_room: {
                      [Op.notIn]: Sequelize.literal(
                        `(
                          SELECT orders.id_room
                          FROM orders
                          JOIN properties ON orders.id_property=properties.id_property
                          WHERE orders.order_status = "CONFIRMED"
                          AND (
                                (orders.checkin_date BETWEEN '${querydate}' AND '${querydate}')
                                OR (orders.checkout_date BETWEEN '${querydate}' AND '${querydate}')
                                OR (orders.checkin_date <= '${querydate}'  AND orders.checkout_date >= '${querydate}') 
                          )  
                        )`
                      )
                  }}
                  ]
                },
                include:[
                    {model:SpecialPricesModel, as:"sprice",required:false,where:{
                      [Op.or]:[
                        {start_date:{[Op.between]:[startDate,endDate]}},
                        {end_date:{[Op.between]:[startDate,endDate]}},
                        {[Op.and]:[{start_date:{[Op.lte]:startDate},end_date:{[Op.gte]:endDate}}]}
                      ]
                    }}
                ],order:[[{model:SpecialPricesModel, as:"sprice"},"id_special_price","desc"]]
              });
            let minprice = null
            
            for(let a of availableRooms){
              let calcprice
              if(a.sprice.length != 0){
                if(d >= new Date(a.sprice[0].start_date) && d <= new Date(a.sprice[0].end_date)){
                  calcprice =a.sprice[0].nominal != null?a.sprice[0].nominal:a.basePrice+((a.sprice[0].percent/100)*a.basePrice) 
                }else{
                  calcprice = a.basePrice
                }
              }else{
                calcprice = a.basePrice
              }
              
              if(minprice == null || minprice > calcprice)
                minprice = calcprice
            }
            // data.push(d.getDate() + " : "+minprice)
            data.push(minprice)
        }
          
        return res.status(200).send({
            data,
            success: true,
        })
    }catch(error){
        console.log(error)
        return res.status(500).send({
            success: false,
            message: "Something Gone Wrong",
            logs:error
        });
    }
  },
  sendOrderMail: async(req,res)=>{
    try {
        const {id_order} = req.query
        propertyData = await OrdersModel.findOne({
          where:{id_order:id_order},
          include:[
            {model: PropertiesModel},
            {model: RoomsModel},
            {model: UsersModel},

          ]
        })
        if(propertyData){
          let tanggal = new Date()
          // tanggal.setHours(0,0,0)
          tanggal.setMinutes ( tanggal.getMinutes() + 2 );

          console.log(tanggal.toDateString(),tanggal.toTimeString())
          const job = schedule.scheduleJob(tanggal, function(){
              transport.sendMail(
                {
                  from: "StayComfy",
                  to: propertyData.user.email,
                  subject: "Reminder Rules of Property Ordered on StayComfy",
                  html: `<div>
                    <p>Dear ${propertyData.user.username},</p>
                    <p>We are thrilled to have you as our guest at our property. To ensure a pleasant and comfortable stay for everyone, we kindly ask you to abide by the following rules:</p>
                    ${propertyData.property.rules}
                    </br>
                    <p>We hope that these guidelines will help you have a pleasant stay at our property. Should you have any questions or concerns, please feel free to reach out to us.</p>
                    <p>Thank you for choosing our property as your accommodation.</p>
                    <p>Best regards,</p>
                    <p>Stay Comfy</p>
                </div>`,
                },
                (err, info) => {
                  if (err) {
                    console.log(`error : ${err}`);
                  }
                  if(info) {
                    // console.log(info);
                  }
                }
              );
          })
        }
        return res.status(200).send({
          success: true,
          message: "Email Terkirim",
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: "Something Gone Wrong",
            logs:error
        });
    }
  },
  getListReview: async(req,res)=>{
    try {
        const {id_property} = req.query
        propertyData = await OrdersModel.findAll({
          where:{[Op.and]:[
            {id_property:id_property},
            {order_status:"CONFIRMED"},
          ]},
          include:[
            {model: PropertiesModel},
            {model: RoomsModel},
            {model: UsersModel},
          ],
          limit:4,
          order:[['id_order','desc']]
        })
        if(propertyData){
            return res.status(200).send({
              success: true,
              data:propertyData,
              message: "Sukses Ambil Review",
            })
        }else{
          return res.status(200).send({
            success: true,
            data:null,
            message: "Review Kosong",
          })
        }
        
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: "Something Gone Wrong",
            logs:error
        });
    }
  },
  
};
