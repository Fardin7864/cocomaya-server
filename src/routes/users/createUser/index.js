const express = require("express");
const addUser = require("../../../api/v1/addUser");
const router = express.Router();

router.post("/api/v1/users", addUser)

module.exports = router;