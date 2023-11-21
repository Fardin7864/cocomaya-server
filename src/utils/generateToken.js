require('dotenv').config();
const jwt = require("jsonwebtoken");


const generateToken = (email) => {
    return jwt.sign(email, process.env.jwt_secret, {
    expiresIn: "1h",
  });}

  module.exports = generateToken;