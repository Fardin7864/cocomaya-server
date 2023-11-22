const express = require("express");
const addToCartController = require("../../../api/v1/cart/addCart");
const router = express.Router();

router.post("/api/v1/cart",addToCartController)

module.exports = router;