const OrdersModel = require("../model/orders");
const PropertiesModel = require("../model/properties");
const CitiesModel = require("../model/cities");
const { dbConf } = require("../config/db");
const { generateInvoiceNumber } = require("../middleware/generate");
const Sequelize = require("sequelize");
const { Op } = require("sequelize");

module.exports = {
  getOrdersDataAll: async (req, res) => {
    try {
      console.log(`datefil `, req.query.datefil);
      console.log(`start `, req.query.startdate);
      console.log(`end `, req.query.enddate);
      console.log(`serach `, req.query.search);
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
        id_user: req.decript.id_user,
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
      const orders = await OrdersModel.findAll({
        attributes: [
          "id_order",
          "no_invoice",
          "total",
          "order_status",
          "checkin_date",
          "checkout_date",
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
      });
      res.json(orders);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  },
  getPropertyData: (req, res) => {
    const propertyId = req.query.propertyId;
    // console.log(propertyId)
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
        // console.log(propertyData)
        // Get city data for the property
        const cityId = propertyData.id_city;
        // console.log(cityId)
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
        // console.log(roomData)
        return res.status(200).send(roomData);
      }
    );
  },
  createOrder: (req, res) => {
    const { id_property, id_room, checkin_date, checkout_date, total } =
      req.body;
    const invoice_number = generateInvoiceNumber(4);
    console.log(invoice_number); // generate the invoice number

    dbConf.query(
      `INSERT INTO orders (id_property, id_room, checkin_date, checkout_date, total, id_user, no_invoice, order_status, createdAt) 
      VALUES (${dbConf.escape(id_property)}, ${dbConf.escape(
        id_room
      )}, ${dbConf.escape(checkin_date)}, 
              ${dbConf.escape(checkout_date)}, ${dbConf.escape(
        total
      )}, ${dbConf.escape(req.decript.id_user)},
              ${dbConf.escape(invoice_number)}, "UNPAID", NOW());
      `,
      (err, results) => {
        if (err) {
          console.log(err);
          return res.status(500).send("Error adding order data to database");
        }

        const orderData = {
          id_order: results.insertId,
          id_user: req.decript.id_user,
          invoice_number: invoice_number,
        };

        console.log(orderData);
        return res.send(orderData);
      }
    );
  },
  paymentProof: (req, res) => {
    console.log("orderId :", req.body.orderId);
    console.log("paymentPoof :", req.file);
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
        const createdAt = new Date(results[0].createdAt);
        const diffTime = Math.abs(currentTime - createdAt);
        const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
        console.log("diffHours:", diffHours);
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
              console.log(results);
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
    try {
      console.log(req.body.id_order);
      const cancel = await dbConf.query(
        `update orders set order_status="CANCELED" where id_order =${dbConf.escape(
          req.body.id_order
        )};`,
        (err, result) => {
          if (err) {
            console.log(err);
            return res.status(500).send(err);
          }
          return res
            .status(200)
            .send({
              success: true,
              message: "Your Order Succesfully be Canceled",
            });
        }
      );
    } catch (err) {
      console.log(err);
      res.status(500).send({ success: false, message: "Server error" });
    }
  },
};
