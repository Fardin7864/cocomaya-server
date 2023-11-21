const jwt = require("jsonwebtoken");
require('dotenv').config();

const verify = (req, res, next) => {
    // console.log("Passed by middleware");
    const token = req.cookies["cocoToken"];
    // console.log(token)
    if (!token) {
      return res.status(401).send({ message: "Unauthorized!" });
    }

    jwt.verify(token, process.env.jwt_secret, (err, decoded) => {
      if (err) {
        console.error("jwt verification error!");
        return res.status(401).send({ message: "Unauthorized!" });
      }
      // console.log("from middlewar", decoded)
      req.user = decoded;
      next();
    });
  };

module.exports = verify