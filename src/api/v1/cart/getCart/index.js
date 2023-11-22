const Cart = require("../../../../models/Carts");


const getCartDataController = async (req, res) => {
    const queryObj = {};
    const sortObj = {};
    const page = req.query.page || 0;
    const pageSize = req.query.pageSize || 10;
    const userEmail = req.query.userEmail;
    if (userEmail) {
      queryObj.userEmail = userEmail;
    }
    try {
      const result = await Cart
        .find(queryObj)
        .sort(sortObj)
        .skip(page * pageSize)
        .limit(pageSize);
        // console.log(result)
      res.send(result);
    } catch (error) {
      res.status(500).send("Server Error!");
    }
  };

module.exports = getCartDataController;