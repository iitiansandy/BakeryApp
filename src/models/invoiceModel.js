const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
    digits: {
        type: Number
    },
    
    invoiceNumber: {
        type: Number,
    }
}, { timestamps: true});

module.exports = mongoose.model('invoice', invoiceSchema);