const Pizza = require("../models/Pizza");

const createPizza = async (req, res) => {
    try {
        const pizza = await Pizza.create(req.body);

        res.status(201).json({
            message: "Pizza created successfully",
            pizza
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to create pizza"
        });
    }
};

const getPizzas = async (req, res) => {
    try {
        const pizzas = await Pizza.find();

        res.json(pizzas);
    } catch (error) {
        res.status(500).json({
            message: "Failed to get pizzas"
        });
    }
};

module.exports = {
    createPizza,
    getPizzas
};