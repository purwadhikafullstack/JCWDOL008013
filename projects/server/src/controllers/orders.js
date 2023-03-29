const OrdersModel = require("../model/orders");
const { dbConf } = require("../config/db");
const { generateInvoiceNumber } = require("../middleware/generate");

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
              ${dbConf.escape(invoice_number)}, "Menunggu Pembayaran", NOW());
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
    const currentTime = new Date()

    // bandingkan sudah  2 jam atau belum
    dbConf.query(
      `select createdAt from orders where id_order=${dbConf.escape(req.body.orderId)};`,
      (err, results) => {
        if (err) {
          return res.status(500).send({
            success: false,
            message: 'tidak bisa ambil data createdAt',
          });
        }
        const createdAt = new Date(results[0].createdAt);
        const diffTime = Math.abs(currentTime - createdAt);
        const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
        console.log('diffHours:', diffHours)
        if (diffHours >= 2) {
          // If more than 2 hours have passed, cancel the order
          dbConf.query(
            `update orders set order_status="Dibatalkan" where id_order=${dbConf.escape(req.body.orderId)};`,
            (err, results) => {
              if (err) {
                console.log(err)
                return res.status(500).send({
                  success: false,
                  message: 'tidak bisa update order_status menjadi batal',
                });
              }
              console.log(results)
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
            )}, order_status="Menunggu Konfirmasi" where id_order=${dbConf.escape(
              req.body.orderId
            )};`,
            (err, results) => {
              if (err) {
                return res.status(500).send({
                  success: false,
                  message: 'tidak bisa update order status menjadi menunggu konfirmasi',
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
};
