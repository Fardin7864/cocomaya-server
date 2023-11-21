const mongoose = require("mongoose");
require('dotenv').config();

const getConnectionString = () => { 
    let connectionURI;
    if(process.env.NODE_ENV === "development"){
        connectionURI = process.env.CONNECTION_URI;
        connectionURI = connectionURI.replace('<user_name>', process.env.DB_USER)
        connectionURI = connectionURI.replace('<password>', process.env.DB_PASSWORD)
    }
    else{
        console.log("Connection uri is not acuret!")
    }
    // else{
    //     connectionURI = process.env.DATABASE_PROD
    // }
    return connectionURI;
 }

 const connectDB = async () => { 
    console.log("Connectin to Database...")
    const uri = getConnectionString();
    // console.log("connection uri: ",uri)
    try {
        await mongoose.connect(uri,{dbName: process.env.DB_NAME})
        console.log("Connected to Database")
    } catch (error) {
        console.log(error)
    }
  }

 module.exports = connectDB;