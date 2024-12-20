const mongoose = require("mongoose");
const { Analiza, Order } = require('../models/mongodbModel');

const getAnaliza = async (req, res) => {
    try {
        let limit = parseInt(req.params.limit) || 0;
        const analiza = await Analiza.find({}).limit(limit).populate('orders');

        if (analiza.length === 0) {
            return res.status(404).json({ "error": "No records found" });
        }

        res.status(200).json(analiza);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ message: error.message });
    }
};


const getAnalizaById = async (req, res) => {
    try {
        const { id } = req.params;
        const analiza = await Analiza.findById(id).populate('orders');

        if (!analiza) {
            return res.status(404).json({ "error": "Record not found" });
        }

        res.status(200).json(analiza);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ message: error.message });
    }
};


const createAnaliza = async (req, res) => {
    try {
        const { firstName, lastName, age, phone, orders } = req.body;

        if (!firstName || !lastName || !age || !phone) {
            return res.status(400).json({ "error": "Bad Request" });
        }

        const analiza = new Analiza({
            firstName,
            lastName,
            age,
            phone
        });

        const savedAnaliza = await analiza.save();

        if (orders && orders.length > 0) {
            for (const order of orders) {
                const newOrder = new Order({
                    ...order,
                    analiza_id: savedAnaliza._id
                });
                await newOrder.save();
            }
        }

        const result = await Analiza.findById(savedAnaliza._id).populate('orders');
        res.status(201).json(result);
    } catch (error) {
        console.error('Error creating record:', error);
        res.status(500).json({ "error": "Internal Server Error" });
    }
};


const updateAnaliza = async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, age, phone, orders } = req.body;

        const analiza = await Analiza.findByIdAndUpdate(id, { firstName, lastName, age, phone }, { new: true });
        if (!analiza) {
            return res.status(404).json({ message: `Record not found` });
        }

        await Order.deleteMany({ analiza_id: id });

        if (orders && orders.length > 0) {
            const orderPromises = orders.map(order => {
                return new Order({
                    analiza_id: id,
                    product: order.product,
                    amount: order.amount
                }).save();
            });
            await Promise.all(orderPromises);
        }

        const updatedAnaliza = await Analiza.findById(id).populate('orders');
        res.status(200).json(updatedAnaliza);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteAnaliza = async (req, res) => {
    try {
        const { id } = req.params;
        const analiza = await Analiza.findByIdAndDelete(id);
        if (!analiza) {
            return res.status(404).json({ message: `Record not found` });
        }

        await Order.deleteMany({ analiza_id: id });

        res.status(200).json(analiza);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAnaliza,
    getAnalizaById,
    createAnaliza,
    updateAnaliza,
    deleteAnaliza
};
