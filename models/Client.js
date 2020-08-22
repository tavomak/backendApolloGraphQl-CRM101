const mongoose = require('mongoose');
// Esquema del CLIENTE en la BBDD
const ClientsSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    company: {
        type: String,
        required: true,
        trim: true,
    },
    email : {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    phone: {
        type: String,
        trim: true,
    },
    vendor : {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    created: {
        type: Date,
        default: Date.now(),
    },
});

module.exports = mongoose.model('Clients', ClientsSchema );