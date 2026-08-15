const mongoose = require("mongoose");

const pizzaSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    base: {
        type: String,
        required: true
    },

    sauce: {
        type: String,
        required: true
    },

    cheese: {
        type: String,
        required: true
    },

    vegetables: {
        type: [String],
        default: []
    },

    price: {
        type: Number,
        required: true
    },

    image: {
        type: String,
        default: ""
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Pizza", pizzaSchema);