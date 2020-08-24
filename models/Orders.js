const mongoose = require('mongoose');
// Esquema del USUARIO en la BBDD
const OrderSchema = mongoose.Schema({
    order: {
        type: Array,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'Clients'
    },
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'User'
    },
    state: {
        type: String,
        default: "PENDIENTE"
    },
    created: {
        type: Date,
        default: Date.now(),
    },
});

module.exports = mongoose.model('Order', OrderSchema );