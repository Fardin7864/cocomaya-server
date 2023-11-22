const { Schema, model } = require("mongoose");

const userSchema = {
    name: String,
    email: String,
    role: String,
}

const Users = model('user',userSchema);

module.exports = Users;