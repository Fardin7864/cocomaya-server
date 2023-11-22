const { Schema, model } = require("mongoose");

const cartSchema = new Schema ({
    cartId : String,
    userEmail : String,
    name : String,
    recipe : String,
    image : String,
    category : String,
    price: Number,
},{versionKey: false})

const Cart = model('cart', cartSchema, 'cart')

module.exports = Cart;