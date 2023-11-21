const generateToken = require("../../../../utils/generateToken");
require("dotenv").config();

const createCookiToken = async (req, res) => {
    const email = req.body;
    // console.log(email)
    const token = generateToken(email);
    // console.log(email, "this is token: ", token)
    try {
      res
        .cookie("cocoToken", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        })
        .send(token);
    } catch (error) {
      res.status(500).send({ message: "JWT error!" });
    }}


    module.exports = createCookiToken;