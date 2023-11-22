const express = require("express");
const verify = require("../../middleware/verifyToken");
const adminCheck = require("../../api/v1/admin");
const router = express.Router();


router.get("/api/v1/users/admin/:email",verify,adminCheck)

module.exports = router;