const mongoose = require("mongoose");

let adminSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            unique: true,
            required: true,
            trim: true,
        },

        businessName: {
            type: String,
            required: true,
            trim: true,
        },

        password: {
            type: String,
            min: 8,
            max: 15,
            required: true
        },

        adminImg: {
            type: String,
        }

    }, { timestamps: true })

module.exports = mongoose.model("Admin", adminSchema);