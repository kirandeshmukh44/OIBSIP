const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { makeToken, hashToken } = require("../utils/tokens");
const { sendEmail } = require("../services/emailService");
const validPassword = password => typeof password === "string" && password.length >= 8 && /\d/.test(password);
const clientUrl = () => process.env.CLIENT_URL || "http://localhost:5173";

const registerUser = async (req, res, next) => { try {
  const { name, email, password } = req.body;
  if (!name || !email || !validPassword(password)) return res.status(400).json({ message: "Name, valid email, and a password of 8+ characters with a number are required" });
  if (await User.findOne({ email: email.toLowerCase() })) return res.status(409).json({ message: "An account with this email already exists" });
  const token = makeToken();
  const user = await User.create({ name, email, password: await bcrypt.hash(password, 12), verificationToken: hashToken(token), verificationTokenExpires: Date.now() + 86400000 });
  await sendEmail({ to: user.email, subject: "Verify your PizzaCraft email", text: `Welcome to PizzaCraft! Verify your email: ${clientUrl()}/verify-email?token=${token}` });
  res.status(201).json({ message: "Registration successful. Please check your email to verify your account.", user: { id: user._id, name: user.name, email: user.email } });
} catch (error) { next(error); } };
const loginUser = async (req, res, next) => { try {
  const { email, password } = req.body; const user = await User.findOne({ email: email?.toLowerCase() });
  if (!user || !(await bcrypt.compare(password || "", user.password))) return res.status(401).json({ message: "Invalid email or password" });
  if (!user.isVerified) return res.status(403).json({ message: "Please verify your email before logging in" });
  const token = jwt.sign({ id: user._id, role: "user" }, process.env.JWT_SECRET, { expiresIn: "1d" });
  res.json({ message: "Login successful", token, user: { id: user._id, name: user.name, email: user.email } });
} catch (error) { next(error); } };
const verifyEmail = async (req, res, next) => { try {
  const user = await User.findOne({ verificationToken: hashToken(req.body.token || req.query.token), verificationTokenExpires: { $gt: Date.now() } });
  if (!user) return res.status(400).json({ message: "This verification link is invalid or has expired" });
  user.isVerified = true; user.verificationToken = undefined; user.verificationTokenExpires = undefined; await user.save(); res.json({ message: "Email verified. You can now log in." });
} catch (error) { next(error); } };
const forgotPassword = async (req, res, next) => { try {
  const user = await User.findOne({ email: req.body.email?.toLowerCase() });
  if (user) { const token = makeToken(); user.resetPasswordToken = hashToken(token); user.resetPasswordExpires = Date.now() + 3600000; await user.save(); await sendEmail({ to: user.email, subject: "Reset your PizzaCraft password", text: `Reset your password: ${clientUrl()}/reset-password?token=${token}` }); }
  res.json({ message: "If an account exists for that email, a reset link has been sent." });
} catch (error) { next(error); } };
const resetPassword = async (req, res, next) => { try {
  const { token, password } = req.body; if (!validPassword(password)) return res.status(400).json({ message: "Password must be at least 8 characters and include a number" });
  const user = await User.findOne({ resetPasswordToken: hashToken(token), resetPasswordExpires: { $gt: Date.now() } });
  if (!user) return res.status(400).json({ message: "This reset link is invalid or has expired" });
  user.password = await bcrypt.hash(password, 12); user.resetPasswordToken = undefined; user.resetPasswordExpires = undefined; await user.save(); res.json({ message: "Password reset successful. Please log in." });
} catch (error) { next(error); } };
const getProfile = async (req, res, next) => { try { const user = await User.findById(req.user.id).select("-password -verificationToken -resetPasswordToken"); res.json({ user }); } catch (error) { next(error); } };
module.exports = { registerUser, loginUser, verifyEmail, forgotPassword, resetPassword, getProfile };
