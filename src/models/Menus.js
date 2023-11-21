const { Schema, model } = require("mongoose");


const MenueSchema = new Schema ({
    name: String,
    recipe: String,
    image: String,
    category: String,
    price: Number,
})

const Menue = model('menu', MenueSchema, 'menu');

module.exports = Menue;