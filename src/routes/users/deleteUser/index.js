const express = require("express");
const verify = require("../../../middleware/verifyToken");
const verifyAdmin = require("../../../middleware/verifyAdmin");
const deleteUserController = require("../../../api/v1/deleteUser");
const router = express.Router();

router.delete(`/api/v1/users/:id`,verify,verifyAdmin,deleteUserController)

module.exports = router;