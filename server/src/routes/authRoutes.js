const express = require("express");

const {
    registerUser,
    loginUser, verifyEmail, forgotPassword, resetPassword, getProfile
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.get("/profile", protect, getProfile);

module.exports = router;
