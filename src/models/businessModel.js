const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;


const businessSchema = new mongoose.Schema({

    userId: {
        type: String,
    },

	looking_for_bizz: {
        type: String,
    },

    industry_bizz: {
        type: String,
        default: "",
    },

    year_of_experience_bizz: {
        type: String,
        default: null,
    },

    education_bizz: {
        type: String,
        default: "",
    }
},
{timestamps: true}
);


module.exports = mongoose.model('Business', businessSchema);