const express = require("express");
const verify = require("../../../middleware/verifyToken");
const deleteCartController = require("../../../api/v1/cart/deleteCart");
const router = express.Router();

router.delete(`/api/v1/cart/:id`,verify,deleteCartController)

module.exports = router;