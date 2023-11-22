const Menue = require("../../../../models/Menus");


const postController = async (req, res) => {
    const menuItem = req.body;
    try {
      const result = await Menue.insertOne(menuItem);
      res.send(result);
    } catch (error) {
      res.status(500).send("Server Error!");
    }
  }

module.exports = postController;