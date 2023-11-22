const express = require("express");
const verify = require("../../../middleware/verifyToken");
const getCartDataController = require("../../../api/v1/cart/getCart");
const router = express.Router();


router.get("/api/v1/cart", verify,getCartDataController)

module.exports = router;