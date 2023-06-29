const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
// const customerModel = require('../models/customerModel');
const { tokenSecretKey } = require("../middlewares/config");
const ObjectId = mongoose.Schema.Types.ObjectId;

const userSchema = new mongoose.Schema({ 
    customerId: {
        type: ObjectId,
        ref: 'Customer'
    },

    mobile: {
        type: String,
        required: true
    }
}, {timestamps: true});

// let customer = await customerModel.findOne({ mobile: mobile });

userSchema.methods.generateJWT = function() {
    const token = jwt.sign({
        _id: this._id,
        mobile: this.mobile,
        customerId: this.customerId,
    }, tokenSecretKey, { expiresIn: "24h" });
    return token;
}

module.exports = mongoose.model('User', userSchema);