const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const orderSchema = new mongoose.Schema(
  {
    customerId: {
      type: ObjectId,
      ref: "Customer",
      trim: true,
    },

    restaurantName: {
      type: String,
      required: true,
    },

    restaurantAddress: {
      type: String,
      required: true,
    },

    restaurantGSTIN: {
      type: String,
      required: true,
    },

    restaurantFSSAI: {
      type: String,
      required: true,
    },

    invoiceNumber: {
      type: String,
      required: true,
    },

    invoiceDate: {
      type: String,
    },

    customerName: {
      type: String,
      required: true,
    },

    deliveryAddress: {
      type: String,
      required: true,
    },

    hsn: {
      type: String,
      required: true,
    },

    items: [
      {
        productId: {
          type: ObjectId,
          ref: "product",
          trim: true,
          required: true,
        },
        quantity: {
          type: Number,
          trim: true,
          required: true,
          min: 1,
        },
        _id: false,

        grossValue: {
          type: Number,
          required: true,
        },

        discount: {
          type: Number,
        },

        netValue: {
          type: Number,
        },

        cgstRate: {
          type: Number,
        },

        cgstValue: {
          type: Number,
        },
        sgstRate: {
          type: Number,
        },
        sgstValue: {
          type: Number,
        },
        total: {
          type: Number,
        },
      },
    ],

    grandTotal: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      default: "pending",
      enum: ["pending", "completed", "cancled"],
    },

    paymentInfo: {
      id: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        required: true,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
