const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const orderSchema = new mongoose.Schema({

  orderID: {
    type: Number
  },
  CGST:{
    type: Number,
  },
  SGST:{
    type: Number,
  },
  totalProduct: {
    type: Number
  },
  paymentType: {
    type: String,
  },
  tax: {
    type: Number,
  },
  total: {
    type: Number,
  },
  grandTotal: {
    type: Number,
  },
  address: {
    type: String,
  },
  apartment: {
    type: String,
  },
  city: {
    type: String,
  },
  countryCode: {
    type: String
  },
  countryName: {
    type: String
  },
  post_code:{
    type: String,
  },
  state_code: {
    type: String,
  },
  state: {
    type: String,
  },
  email: {
    type: String,
  },
  f_name: {
    type: String,
  },
  l_name: {
    type: String,
  },
  mobile: {
    type: String,
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected", "Shipped", "Completed", "Cancel"],
    default: "Pending"
  },
  customerId: {
    type: String,
  },

  question: {
    type: String,
  },

  feedback: {
    type: String,
  },
  
  productList: [
    {
      productId: {
        type: ObjectId,
        ref: 'Product',
      },
      MrpTotal: {
        type: Number,
      },
      SubTotal: {
        type: Number
      },
      averageRating: {
        type: Number
      },
      cartQty: {
        type: Number
      },
      description: {
        type: String,
      },
      isVeg: {
        type: Boolean,
      },
      mrp: {
        type: Number
      },
      name: {
        type: String
      },
      salePrice: {
        type: Number
      },
      skuCode: {
        type: String,
      },
      thumbnail: {
        type: String,
      },
      totalRatingCount: {
        type: Number
      }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);