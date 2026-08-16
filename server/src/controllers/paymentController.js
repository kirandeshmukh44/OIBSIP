const Razorpay = require("razorpay");
const crypto = require("crypto");
const mongoose = require("mongoose");
const Order = require("../models/Order");
const Inventory = require("../models/Inventory");
const instance = () => new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });

const createPaymentOrder = async (req, res, next) => { try {
    const order = await Order.findOne({ _id: req.body.orderId, user: req.user.id });
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.paymentStatus === "paid") return res.status(400).json({ message: "Order is already paid" });
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) return res.status(503).json({ message: "Payments are not configured" });
    const razorpayOrder = await instance().orders.create({ amount: Math.round(order.totalAmount * 100), currency: "INR", receipt: order._id.toString() });
    order.razorpayOrderId = razorpayOrder.id; await order.save();
    res.json({ razorpayOrder, keyId: process.env.RAZORPAY_KEY_ID });
} catch (error) { next(error); } };

const verifyPayment = async (req, res, next) => { try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const order = await Order.findOne({ razorpayOrderId: razorpay_order_id, user: req.user.id });
    if (!order) return res.status(404).json({ message: "Order not found" });
    const signature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(`${razorpay_order_id}|${razorpay_payment_id}`).digest("hex");
    if (signature !== razorpay_signature) { order.paymentStatus = "failed"; await order.save(); return res.status(400).json({ message: "Payment verification failed" }); }
    const ingredients = [[order.pizzaBase, "Pizza Bases"], [order.sauce, "Sauces"], [order.cheese, "Cheeses"], ...order.vegetables.map(item => [item, "Vegetables"])];
    const session = await mongoose.startSession();
    try {
        await session.withTransaction(async () => {
            for (const [item, category] of ingredients) {
                const updated = await Inventory.findOneAndUpdate({ name: item.name, category, quantity: { $gte: 1 } }, { $inc: { quantity: -1 } }, { new: true, session });
                if (!updated) throw new Error("OUT_OF_STOCK");
            }
            order.paymentStatus = "paid"; order.razorpayPaymentId = razorpay_payment_id; await order.save({ session });
        });
    } catch (error) {
        if (error.message === "OUT_OF_STOCK") return res.status(409).json({ message: "Sorry, this ingredient is currently out of stock." });
        throw error;
    } finally { await session.endSession(); }
    req.app.get("io")?.to(`user:${req.user.id}`).emit("order:updated", order);
    res.json({ message: "Payment verified and order confirmed", order });
} catch (error) { next(error); } };
module.exports = { createPaymentOrder, verifyPayment };
