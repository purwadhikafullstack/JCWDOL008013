const RoomsModel = require("../model/rooms");
const { Op } = require("sequelize");

module.exports = {
  getRoomsData: async (req, res) => {
    try {
      let data = await RoomsModel.findAll();
      return res.status(200).send(data);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  addRoom: async (req, res) => {
    try {
      let { id_property, name, price, description } = req.body;
      let create = await RoomsModel.create({
        id_property,
        name,
        basePrice: price,
        description,
        picture: `/imgRoom/${req.file.filename}`,
      });
      res.status(200).send({
        success: true,
        message: "Add Room Success",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  getRoom: async (req, res) => {
    try {
      const id_property = req.query.property;
      const page = parseInt(req.query.page) || 0;
      const limit = 5;
      const offset = limit * page;
      const keyword = req.query.keyword || "";
      const sort = req.query.sort || "id_room";
      const order = req.query.order || "ASC";
      let data = await RoomsModel.findAndCountAll({
        limit,
        offset,
        where: {
          id_property,
          status: 1,
          name: {
            [Op.like]: "%" + keyword + "%",
          },
        },
        order: [[sort, order]],
      });
      return res
        .status(200)
        .send({ ...data, totalPage: Math.ceil(data.count / limit) });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  editRoom: async (req, res) => {
    try {
      let { id_room, name, price, description } = req.body;
      let update = await RoomsModel.update(
        {
          name,
          basePrice: price,
          description,
          picture: `/imgRoom/${req.file.filename}`,
        },
        {
          where: {
            id_room,
          },
        }
      );
      return res.status(200).send({
        success: true,
        message: "Edit Room Success",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  deleteRoom: async (req, res) => {
    try {
      let update = await RoomsModel.update(
        {
          status: 0,
        },
        {
          where: {
            id_room: req.body.id_room,
          },
        }
      );
      return res.status(200).send({
        success: true,
        message: "Delete Room Success",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  getDetail: async (req, res) => {
    try {
      const id_property = req.query.property;
      const id_room = req.query.room;
      let data = await RoomsModel.findAll({
        where: {
          id_property,
          id_room,
        },
      });
      return res.status(200).send(data);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
};
