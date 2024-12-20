const { DataTypes } = require('sequelize');

const createAnalizaModel = (sequelize) => {
    return sequelize.define('analiza', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        firstname: {
            type: DataTypes.STRING
        },
        lastname: {
            type: DataTypes.STRING
        },
        age: {
            type: DataTypes.INTEGER
        },
        phone: {
            type: DataTypes.INTEGER
        }
    }, {
        freezeTableName: true,
        timestamps: false,
    });
};

const createOrderModel = (sequelize) => {
    return sequelize.define('orders', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        analiza_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'analiza',
                key: 'id'
            },
        },
        product: {
            type: DataTypes.STRING,
        },
        amount: {
            type: DataTypes.INTEGER,
        }
    }, {
        freezeTableName: true,
        timestamps: false,
    });
};

module.exports = {
    createAnalizaModel,
    createOrderModel
};
