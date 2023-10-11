const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;


const datingSchema = new mongoose.Schema({
    
    userId: {
        type: String,
    },

    cooking: {
        type: String,
        default: "",
    },
    
    eatingHabits: {
        type: String,
        default: "",
    },
    
    excercise: {
        type: String,
        default: "",
    },

    height: {
        type: Number
    },

    isShow_my_interests: {
        type: Boolean,
        default: false,
    },

    kids: {
        type: String,
        default: "",
    },

    looking_for: {
        type: String
    },

    my_interests: [],

    partying: {
        type: String,
        default: "",
    },

    politics: {
        type: String,
        default: "",
    },

    religion: {
        type: String,
        default: "",
    },

    smoking: {
        type: String,
        default: "",
    },

    starSign: {
        type: String,
        default: "",
    }
},
{timestamps: true}
)

module.exports = mongoose.model('Dating', datingSchema);