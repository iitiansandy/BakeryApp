const CODModel = require("../models/CODModel");
const productModel = require("../models/productModel");
const customerModel = require("../models/customerModel");
const orderModel = require("../models/orderModel");
const { isValidObjectId } = require("mongoose");

// CHECKOUT COD
const checkoutCOD = async (req, res) => {
  try {
    let data = req.body;
    let {
      orderId,
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

    let checkoutData = {
      orderId,
      fullName,
      mobile,
      GST,
      grandTotal,
      tax,
      total,
      totalProducts,
      shippingCharges
    };

    let newCheckoutData = await CODModel.create(checkoutData);

    return res
      .status(201)
      .send({ status: true, message: "success", data: newCheckoutData });
  } catch (error) {
    return res.status(500).send({ error: "error while verifing OTP" });
  }
};

module.exports = { checkoutCOD };
