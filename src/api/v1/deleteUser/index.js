const Users = require("../../../models/Users");

const {ObjectId} = require("mongoose").Types


const deleteUserController = async (req, res) => {
    const id = req.params.id;
    const email = req.body.email;
    const query = {
      _id: new ObjectId(id),
      email: email,
    };
    try {
      const result = await Users.deleteOne(query);
      res.send(result);
    } catch (error) {
      res.status(500).send("Server Error!!");
    }
  }

module.exports = deleteUserController;