const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const reportUserSchema = new mongoose.Schema({
    userId: {
        type: String,
    },

    accountType: {
        type: String,
    },

    postType: {
        type: String,
        enum: ["PARTNER", "TRIP"]
    },

    questions: [],

    feedback: {
        type: String,
    },

    targetUserId: {
        type: String,
    },

    tripId: {
        type: String,
    },

    travelPartnerId: {
        type: String,
    },

    isReported: {
        type: Boolean,
        default: false,
    }
}, {timestamps: true});

module.exports = mongoose.model('ReportedUser', reportUserSchema);