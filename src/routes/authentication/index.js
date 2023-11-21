const express = require('express');
const createCookiToken = require('../../api/v1/authentication/controllers/createCookieToken');
const router = express.Router();


router.post('/api/v1/jwt', createCookiToken )

module.exports = router;