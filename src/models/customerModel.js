const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },

    gender: {
      type: String,
      required: true,
    },

    profileImage: {
      type: String,
      trim: true,
    },

    mobile: {
      type: String,
      unique: true,
      required: true,
    },

    password: {
      type: String,
      min: 8,
      max: 15,
      required: true,
    },

    otp: {
      type: String,
    },
    
    email_verified: {
      type: Boolean,
      default: false,
    },

    address: {
      shipping: {
        street: { type: String, trim: true, required: true },
        city: { type: String, trim: true, required: true },
        state: { type: String, trim: true, required: true },
        pincode: { type: Number, required: true },
      },
      billing: {
        street: { type: String, trim: true, required: true },
        city: { type: String, trim: true, required: true },
        city: { type: String, trim: true, required: true },
        pincode: { type: Number, required: true },
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model( "Customer", customerSchema );