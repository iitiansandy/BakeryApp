const { trimEnd } = require("lodash");
const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },

    customerId: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      unique: true,
      trim: true,
    },

    dialingCode: {
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
    },

    DOB: {
      type: String,
    },

    FCMToken: {
      type: String,
    },

    gender: {
      type: String,
    },

    address: {
      shipping: {
        street: { type: String, trim: true },
        city: { type: String, trim: true },
        state: { type: String, trim: true },
        pincode: { type: Number },
      },
      billing: {
        street: { type: String, trim: true},
        city: { type: String, trim: true},
        city: { type: String, trim: true },
        pincode: { type: Number },
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model( "Customer", customerSchema );