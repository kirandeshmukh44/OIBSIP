const mongoose = require("mongoose");
const inventorySchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, enum: ["Pizza Bases", "Sauces", "Cheeses", "Vegetables"] },
    quantity: { type: Number, required: true, min: 0, default: 0 },
    threshold: { type: Number, required: true, min: 0, default: 10 }
}, { timestamps: true });
inventorySchema.index({ name: 1, category: 1 }, { unique: true });
module.exports = mongoose.model("Inventory", inventorySchema);
