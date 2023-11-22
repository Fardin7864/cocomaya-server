const Cart = require("../../../../models/Carts");


const addToCartController = async (req, res) => {
    const food = req.body;
    // console.log(food)
    try {
      const result = await Cart.create(food);
    //   console.log(result)
      res.send(result);
    } catch (error) {
      res.status(500).send("Server Error!!");
    }
  }

  module.exports = addToCartController;