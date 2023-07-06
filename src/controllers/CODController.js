const CODModel = require("../models/CODModel");
const productModel = require("../models/productModel");
const customerModel = require("../models/customerModel");
const orderModel = require("../models/orderModel");
const { isValidObjectId } = require("mongoose");
const { isValid } = require("../utils/utils");

// CHECKOUT COD
const checkoutCOD = async (req, res) => {
  try {
    let data = req.body;
    let {
      orderId,
      customerId,
      fullName,
      mobile,
      GST,
      grandTotal,
      tax,
      total,
      totalProducts,
      shippingCharges,
    } = data;

    if (!isValidObjectId(orderId)) {
      return res
        .status(400)
        .send({ status: false, message: "Invalid order id" });
    }

    if (!isValid(fullName)) {
      return res
        .status(400)
        .send({ status: false, message: "Full name is required" });
    }

    if (!isValid(GST)) {
      return res.status(400).send({ status: false, message: 'GST is required'})
    }

    let checkoutData = {
      orderId,
      customerId,
      fullName,
      mobile,
      GST,
      grandTotal,
      tax,
      total,
      totalProducts,
      shippingCharges,
    };

    let newCheckoutData = await (
      await CODModel.create(checkoutData)
    ).populate("totalProducts");

    return res
      .status(201)
      .send({ status: true, message: "success", data: newCheckoutData });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { checkoutCOD };