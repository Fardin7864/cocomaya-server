const express = require("express");
const cors = require("cors");
var cookieParser = require("cookie-parser");
const { LOCAL_CLIENT, CLIENT } = require("../config/default");

const applyMiddleWare = (app) => {
  app.use(express.json());
  app.use(cookieParser());
  app.use(
    cors({
      origin: [
        LOCAL_CLIENT,
        CLIENT
      ],
      credentials: true,
      methods: ["GET", "PUT", "POST", "PATCH", "DELETE"],
    })
  );

};


module.exports = applyMiddleWare;