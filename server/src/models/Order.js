const mongoose = require("mongoose");
const ingredientSchema = new mongoose.Schema({ name: String, price: Number }, { _id: false });
const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    pizzaBase: { type: ingredientSchema, required: true }, sauce: { type: ingredientSchema, required: true },
    cheese: { type: ingredientSchema, required: true }, vegetables: { type: [ingredientSchema], default: [] },
    totalAmount: { type: Number, required: true, min: 0 },
    paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
    orderStatus: { type: String, enum: ["Order Received", "In Kitchen", "Sent to Delivery"], default: "Order Received" },
    razorpayOrderId: String, razorpayPaymentId: String
}, { timestamps: true });
module.exports = mongoose.model("Order", orderSchema);
