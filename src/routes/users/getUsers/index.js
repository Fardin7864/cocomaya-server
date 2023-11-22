const express = require("express");
const verify = require("../../../middleware/verifyToken");
const verifyAdmin = require("../../../middleware/verifyAdmin");
const getUsersController = require("../../../api/v1/getUsers");
const router = express.Router();


router.get("/api/v1/users",verify,verifyAdmin,getUsersController)

module.exports = router;