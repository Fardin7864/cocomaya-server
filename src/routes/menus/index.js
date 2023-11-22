const express = require("express");
const router = express.Router();
const menuControler = require("../../api/v1/menu/controllers/controllers");
const postController = require("../../api/v1/menu/controllers/postController");

router.get("/api/v1/menu", menuControler);
router.post("/api/v1/menu", postController);

module.exports = router;