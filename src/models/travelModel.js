const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;


const travelSchema = new mongoose.Schema({

    userId: {
        type: String,
    },

    drinkTravel: {
        type: String,
    },

    eatingHabitsTravel: {
        type: String,
    },

    is_travel_show_my_interests: {
        type: Boolean,
        default: true,
    },

    looking_for_travel: {
        type: String,
    },

    religion: {
        type: String,
        default: "",
    },

    smoke_travel: {
        type: String,
        default: "",
    },

    travelType: {
        type: String,
        default: "",
    },

    travel_my_interests: [],

    nationality: {
        type: String,
        default: "",
    },
},
{timestamps: true}
);

module.exports = mongoose.model('Travel', travelSchema);
