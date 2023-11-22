const express = require("express");
const verify = require("../../../middleware/verifyToken");
const verifyAdmin = require("../../../middleware/verifyAdmin");
const createAdminController = require("../../../api/v1/createAdmin");
const router = express.Router();

router.patch("/api/v1/users/admin/:id",verify,verifyAdmin,createAdminController)

module.exports = router;