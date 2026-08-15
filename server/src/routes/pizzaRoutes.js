const express = require("express");

const {
    createPizza,
    getPizzas
} = require("../controllers/pizzaController");

const router = express.Router();

router.post("/", createPizza);
router.get("/", getPizzas);

module.exports = router;