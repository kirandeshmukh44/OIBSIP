const PizzaOption = require("../models/PizzaOption");

const createOption = async (req, res) => {
    try {
        const option = await PizzaOption.create(req.body);

        res.status(201).json({
            message: "Option created successfully",
            option
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to create option"
        });
    }
};

const getOptions = async (req, res) => {
    try {
        const options = await PizzaOption.find();

        res.json(options);
    } catch (error) {
        res.status(500).json({
            message: "Failed to get options"
        });
    }
};

module.exports = {
    createOption,
    getOptions
};