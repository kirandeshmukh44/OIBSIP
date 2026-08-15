const express = require("express");

const {
    createOption,
    getOptions
} = require("../controllers/pizzaOptionController");

const router = express.Router();

router.post("/", createOption);
router.get("/", getOptions);

module.exports = router;