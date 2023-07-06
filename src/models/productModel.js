const mongoose = require("mongoose");
let ObjectId = mongoose.Schema.Types.ObjectId;

const productSchema = new mongoose.Schema(
  {
    skuCode: {
      type: String,
    },

    isVeg: {
      type: Boolean,
    },

    name: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    qty: {
      type: Number,
    },

    salePrice: {
      type: Number,
    },

    mrp: {
      type: Number,
    },

    thumbnail: {
      type: String,
    },

    ratings: [
      {
        customerId: {
          type: ObjectId,
          ref: "Customer",
        },
        name: {
          type: String,
        },
        rating: {
          type: Number,
        },
        comment: {
          type: String,
        },
        time: {
          type: String
        }
      },
    ],

    averageRating: {
      type: Number,
    },

    totalRatingCount: {
      type: Number,
    },

    ratingPercentages: {

    },

    deletedAt: { type: Date, default: null },

    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
