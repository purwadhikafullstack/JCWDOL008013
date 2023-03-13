const RoomsModel = require("../model/rooms");

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
  createUpdateRooms: async(req, res)=>{
    try {
      let data = await RoomsModel.upsert()
      return res.status(200).send(data)
    } catch (error) {
        return res.status(500).send(error)
    }
  },
  removeRooms: async(req,res)=>{
      try {
        let data = await RoomsModel.destroy({
          where: {
              // criteria
          }
      })
        return res.status(200).send(data)
      } catch (error) {
          return res.status(500).send(error)
      }
  },
};
