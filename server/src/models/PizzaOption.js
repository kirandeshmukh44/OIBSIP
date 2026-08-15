const mongoose = require("mongoose");

const pizzaOptionSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },

    name: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model("PizzaOption", pizzaOptionSchema);