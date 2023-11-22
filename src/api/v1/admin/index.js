const Users = require("../../../models/Users");


const adminCheck = async (req, res) => {
    const email = req.params.email;
    const query = { email: email };
    // console.log("this from middle",req.user)
    if (email !== req.user.email) {
      return res.status(403).send("Unauthorized!");
    }
    try {
      const user = await Users.findOne(query);
      // console.log(user)
      let admin = false;
      if (user) {
        admin = user?.role === "admin";
      }
      // console.log(admin)
      res.send(admin);
    } catch (error) {
      res.status(500).send("server error!");
    }
  }

module.exports = adminCheck;