const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const CODSchema = new mongoose.Schema({
    oderId: {
        type: String,
    },

    customerId: {
        type: String,
    },

    fullName: {
        type: String,
    },

    mobile: {
        type: String,
    },

    GST: {
        type: Number,
    },

    grandTotal: {
        type: Number
    },

    tax: {
        type: Number
    },

    total: {
        type: Number
    },

    totalProducts: [
        {
            type: ObjectId,
            ref: 'Product'
        }
    ],

    shippingCharges: {
        type: Number
    },
}, {timestamps: true})


module.exports = mongoose.model('COD', CODSchema);