const Menue = require("../../../../models/Menus");


const menuControler = async (req, res) => {
    const query = {};
    try {
        const result = await Menue.find(query);
        // console.log(result)
        res.send(result);
    } catch (error) {
      res.status(500).send("Server error!");
    }
  }

module.exports = menuControler;