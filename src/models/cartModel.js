const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const cartShema = new mongoose.Schema(
  {
    customerId: {
      type: ObjectId,
      ref: "Customer",
      required: "customerId is required",
      trim: true,
      unique: true,
    },
    items: [
      {
        shopId: {
          type: ObjectId,
          ref: "Shop",
        },
        productId: {
          type: ObjectId,
          ref: "product",
          required: true,
          trim: true,
        },
        quantity: {
          type: Number,
          trim: true,
          min: 1,
        },
        _id: false,
      },
    ],

    totalPrice: {
      type: Number,
      trim: true,
    },

    totalItems: {
      type: Number,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartShema);
