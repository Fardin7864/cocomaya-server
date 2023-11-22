const {ObjectId} = require("mongoose").Types
const Users = require("../../../models/Users");


const createAdminController = async (req, res) => {
    const id = req.params.id;
    if(!ObjectId.isValid(id)){
        return res.status(400).send("Invalid Id!")
    }
    const query = { _id: new ObjectId(id) };
    const update = {
      $set: { role: "admin" },
    };
    try {
      const result = await Users.updateOne(query, update);
      res.send(result);
    } catch (error) {
      res.status(500).send("Server error!");
    }
  }

module.exports = createAdminController;