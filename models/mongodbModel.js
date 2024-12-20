const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    analiza_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Analiza',
        required: true
    },
    product: {
        type: String,
    },
    amount: {
        type: Number,
    }
});

const analizaSchema = new mongoose.Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    age: {
        type: Number,
        default: 0
    },
    phone: {
        type: Number,
    }
}, {
    timestamps: true
});

analizaSchema.virtual('orders', {
    ref: 'Order',
    localField: '_id',
    foreignField: 'analiza_id'
});

analizaSchema.set('toObject', { virtuals: true });
analizaSchema.set('toJSON', { virtuals: true });

const Analiza = mongoose.model('Analiza', analizaSchema);
const Order = mongoose.model('Order', orderSchema);

module.exports = { Analiza, Order };
