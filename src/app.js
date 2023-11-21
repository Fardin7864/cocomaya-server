const express = require("express");
const applyMiddleWare = require("./middleware/applyMiddleware");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;




applyMiddleWare(app)


app.get("/health", (req, res) => {
    res.send("Server is runnig");
  });

app.all('*', (req,res,next) => { 
    const error = new Error(`The requested url is invalid: [${req.url}]`)
    error.status = 404
    next(error)
 })

app.use((err,req,res,next) => {
    res.status(err.status || 500 ).json({
        message: err.message
    })
})
  
  app.listen(port, () => {
    console.log(`Server is runnig on port ${port}`);
  });
  