const Cart = require("../../../../models/Carts");
const {ObjectId} = require("mongoose").Types



const deleteCartController = async (req, res) => {
    const id = req.params.id;
    const email = req.body.userEmail;
    // console.log("id:",id, "email:",email)
    const query = {
        $and:[

            {_id: new ObjectId(id)},
            {userEmail: email},
        ]
    };
    try {
      const result = await Cart.deleteOne(query);
      res.send(result);
    } catch (error) {
      res.status(500).send("Server Error!!");
    }
  }

module.exports = deleteCartController;