const Users = require("../../../models/Users");


const getUsersController = async (req, res) => {
    console.log("user route hited!!!");
    try {
      const result = await Users.find();
      // console.log(result)
      res.send(result);
    } catch (error) {
      res.status(500).send("server error!");
    }
  }

module.exports = getUsersController;