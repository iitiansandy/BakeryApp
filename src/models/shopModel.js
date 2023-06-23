const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const shopSchema = new mongoose.Schema({
    adminId: {
        type: ObjectId,
        ref: 'Admin'
    },

    shopNumber: {
        type: Number,
        required: true,
        unique: true
    },

    shopAddress: {
        type: String,
        required: true,
        unique: true
    },

    productId: {
        type: ObjectId,
        ref: 'Product'
    },

    products: []
}, 
{timestamps: true});

module.exports = mongoose.model( 'Shop', shopSchema );