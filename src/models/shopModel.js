const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const shopSchema = new mongoose.Schema({
    shopNumber: {
        type: Number,
        required: true,
        unique: true
    },

    shopAddress: {
        type: String,
        unique: true
    },

    productId: {
        type: ObjectId,
        ref: 'Product'
    },

    banners: {
        type: String,
    },

    helplineNumber: {
        type: String,
    },

    description: {
        type: String,
    }
}, 
{timestamps: true});

module.exports = mongoose.model( 'Shop', shopSchema );