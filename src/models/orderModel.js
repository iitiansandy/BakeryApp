const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const orderSchema = new mongoose.Schema({
  CGST:{
    type: Number,
  },
  SGST:{
    type: Number,
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
  customerId: {
    type: String,
  },
  productList: [
    {
      productId: {
        type: ObjectId,
        ref: 'Product',
      },
      cart_qty: {
        type: Number
      }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);