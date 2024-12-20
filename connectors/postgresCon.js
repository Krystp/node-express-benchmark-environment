const { Sequelize } = require('sequelize');
const { createAnalizaModel, createOrderModel } = require('../models/postgresModel');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.PG_DB,       // Database
    process.env.PG_USER,     // Username
    process.env.PG_PASSWORD, // Password
    {
        host: process.env.PG_HOST,    // Host
        dialect: process.env.PG_DIALECT // Dialect (Postgres)
    }
);

let AnalizaModel = null;
let OrderModel = null;

const connectionPg = async () => {
    try {
        await sequelize.authenticate();
        console.log('Postgres connection has been established successfully.');

        AnalizaModel = createAnalizaModel(sequelize);
        OrderModel = createOrderModel(sequelize);

        AnalizaModel.hasMany(OrderModel, { foreignKey: 'analiza_id' });
        OrderModel.belongsTo(AnalizaModel, { foreignKey: 'analiza_id' });

        await sequelize.sync();
        console.log('Database synchronized');
    } catch (error) {
        console.error('Unable to connect to the postgres database:', error);
    }
};

const getAnalizaModel = () => AnalizaModel;
const getOrderModel = () => OrderModel;

module.exports = {
    connectionPg,
    getAnalizaModel,
    getOrderModel,
};
