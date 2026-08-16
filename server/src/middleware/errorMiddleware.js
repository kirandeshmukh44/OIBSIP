module.exports = (err, req, res, next) => {
    console.error(err); if (res.headersSent) return next(err);
    if (err.name === "ValidationError") return res.status(400).json({ message: Object.values(err.errors)[0].message });
    if (err.code === 11000) return res.status(409).json({ message: "A record with that value already exists" });
    res.status(500).json({ message: "Something went wrong. Please try again." });
};
