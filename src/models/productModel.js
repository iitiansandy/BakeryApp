const mongoose = require("mongoose");
let ObjectId = mongoose.Schema.Types.ObjectId;

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      trim: true,
    },

    productImage: {
      type: String,
    },

    adminId: {
      type: ObjectId,
      ref: "Admin",
    },

    shopId: {
      type: ObjectId,
      ref: 'Shop'
    },

    deletedAt: { type: Date, default: null },

    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
