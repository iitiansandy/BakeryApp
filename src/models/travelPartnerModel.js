const mongoose = require('mongoose');
// const ObjectId = mongoose.Schema.Types.ObjectId;

const travelPartnerSchema = new mongoose.Schema({
    userId: {
        type: String,
    },

    journey: {
        type: String,
    },

    leaving_from: {
        type: String,
    },

    going_to: {
        type: String,
    },

    date: {
        type: String,
    },

    gender: {
        type: String,
    },

    interestList: []
}, {timestamps: true});

module.exports = mongoose.model('TravelPartner', travelPartnerSchema);