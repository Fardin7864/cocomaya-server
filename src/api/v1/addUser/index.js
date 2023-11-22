const Users = require("../../../models/Users");



const addUser = async (req, res) => {
    const user = req.body;
    const query = { email: user.email };
    try {
      const signleUser = await Users.findOne(query);
      if (signleUser) {
        return res.send({ message: "This email already exist!" });
      }
      const result = await userColl.insertOne(user);
      res.send(result);
    } catch (err) {
        // next(err)
      res.status(5000).send("Server error!");
    }
  }

module.exports = addUser;