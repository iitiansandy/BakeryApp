const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;


const BFFSchema = new mongoose.Schema({

    userId: {
        type: String,
    },

    bizzmy_interests: {
        type: Array,
        default: null
    },

    isBizz_show_my_interests: {
        type: Boolean,
        default: false,
    },

    looking_for_bff: {
        type: String,
        default: "relationship"
    },

    kids_bff: {
        type: String,
        default: "",
    },

    exercise_bff: {
        type: String,
        default: "",
    },

    new_to_area_bff: {
        type: String,
        default: null,
    },

    politics_bff: {
        type: String,
        default: "",
    },

    religion_bff: {
        type: String,
        default: "",
    },

    relationship_bff: {
        type: String,
        default: "",
    },

    smoking: {
        type: String,
        default: "",
    },

    drinkingBff: {
        type: String,
        default: "",
    }
},
{timestamps: true}
);

module.exports = mongoose.model('BFF', BFFSchema)