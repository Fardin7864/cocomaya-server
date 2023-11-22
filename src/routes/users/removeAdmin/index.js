const express = require("express");
const verify = require("../../../middleware/verifyToken");
const verifyAdmin = require("../../../middleware/verifyAdmin");
const removeAdminController = require("../../../api/v1/removeAdmin/removeAdmin");
const router = express.Router();

router.patch("/api/v1/users/normal/:id",verify,verifyAdmin,removeAdminController);

module.exports = router;