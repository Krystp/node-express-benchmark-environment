const { getAnalizaModel, getOrderModel } = require('../connectors/postgresCon');

const getAnaliza = async (req, res) => {
    const limitParam = req.params.limit;
    const limit = limitParam ? parseInt(limitParam) : null;

    try {
        const options = {};
        if (limit !== null && !isNaN(limit)) {
            options.limit = limit;
        }

        const AnalizaModel = getAnalizaModel();
        const analiza = await AnalizaModel.findAll({
            ...options,
            include: getOrderModel()
        });

        if (analiza.length === 0) {
            return res.status(404).json({ "error": "No records found" });
        }

        return res.status(200).json(analiza);
    } catch (error) {
        console.error('Error fetching data:', error);
        return res.status(500).json({ "error": "Internal Server Error" });
    }
}

const getAnalizaById = async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        const AnalizaModel = getAnalizaModel();
        const analiza = await AnalizaModel.findOne({
            where: { id },
            include: getOrderModel()
        });
        if (!analiza) {
            return res.status(404).json({ "error": "Record not found" });
        }
        return res.status(200).json(analiza);
    } catch (error) {
        console.error('Error fetching data:', error);
        return res.status(500).json({ "error": "Internal Server Error" });
    }
}

const createAnaliza = async (req, res) => {
    const { firstname, lastname, age, phone, orders } = req.body;

    if (!firstname || !lastname || !age || !phone) {
        return res.status(400).json({ "error": "Bad Request" });
    }

    try {
        const AnalizaModel = getAnalizaModel();
        const OrderModel = getOrderModel();

        const analiza = await AnalizaModel.create({ firstname, lastname, age, phone });

        if (orders && orders.length > 0) {
            for (const order of orders) {
                await OrderModel.create({ ...order, analiza_id: analiza.id });
            }
        }

        const result = await AnalizaModel.findOne({
            where: { id: analiza.id },
            include: { model: OrderModel }
        });

        return res.status(201).json(result);
    } catch (error) {
        console.error('Error creating record:', error);
        return res.status(500).json({ "error": "Internal Server Error" });
    }
};


const deleteAnaliza = async(req, res) => {
    const id = parseInt(req.params.id);

    try {
        const AnalizaModel = getAnalizaModel();
        const analiza = await AnalizaModel.findOne({ where: { id } });
        if (analiza === null) {
            return res.status(404).json({ message: "Record not found" });
        }
        await analiza.destroy();
        return res.status(200).json(analiza);
    } catch (error) {
        console.error('Error deleting record:', error);
        return res.status(500).json({ "error": "Internal Server Error" });
    }
}

const updateAnaliza = async (req, res) => {
    const id = parseInt(req.params.id);
    const { firstname, lastname, age, phone, orders } = req.body;

    try {
        const AnalizaModel = getAnalizaModel();
        const OrderModel = getOrderModel();

        const [updatedRows] = await AnalizaModel.update(
            { firstname, lastname, age, phone },
            { where: { id } }
        );

        if (updatedRows === 0) {
            return res.status(404).json({ "error": "Record not found" });
        }

        if (orders && orders.length > 0) {
            await OrderModel.destroy({ where: { analiza_id: id } });
            for (const order of orders) {
                await OrderModel.create({
                    analiza_id: id,
                    product: order.product,
                    amount: order.amount
                });
            }
        }

        const updatedAnaliza = await AnalizaModel.findOne({
            where: { id },
            include: OrderModel
        });

        return res.status(200).json(updatedAnaliza);
    } catch (error) {
        console.error('Error updating record:', error);
        return res.status(500).json({ "error": "Internal Server Error" });
    }
}

module.exports = {
    getAnaliza,
    getAnalizaById,
    createAnaliza,
    deleteAnaliza,
    updateAnaliza
}
