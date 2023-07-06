const orderModel = require("../models/orderModel");
const productModel = require("../models/orderModel");
const customerModel = require("../models/customerModel");
const { isValidRequestBody, isValidStatus } = require("../utils/utils");

// CREATE ORDER
const createOrder = async (req, res) => {
  try {
    let customerId = req.params.customerId;
    let data = req.body;

    if (!isValidRequestBody(data)) {
      return res
        .status(400)
        .send({ status: false, message: "Please enter data in body" });
    }

    let customer = await customerModel.findOne({ customerId: customerId });

    let {
      CGST,
      SGST,
      paymentType,
      tax,
      total,
      grandTotal,
      address,
      apartment,
      city,
      countryCode,
      countryName,
      post_code,
      state_code,
      state,
      email,
      f_name,
      l_name,
      mobile,
      productList,
    } = data;

    let { productId, cart_qty } = productList;

    let orderData = {
      CGST,
      SGST,
      paymentType,
      tax,
      total,
      grandTotal,
      address,
      apartment,
      city,
      countryCode,
      countryName,
      post_code,
      state_code,
      state,
      email,
      f_name,
      l_name,
      mobile,
      customerId: req.body.customerId,
      productList,
    };

    let newOrder = await orderModel.create(orderData);

    // Populate the productId field separately on the created document
    await newOrder.populate({
      path: "productList.productId",
      select: "-ratings -averageRating -totalRatingCount -ratingPercentages",
    });

    return res.status(201).send({
      status: true,
      message: "Order placed successcully",
      data: newOrder,
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

// CANCEL ORDER BY ORDER ID
const cancelOrderById = async (req, res) => {
  try {
    let orderId = req.params.orderId;
    if (!isValidObjectId(orderId)) {
      return res
        .status(400)
        .send({ status: false, message: "Invalid order id" });
    }

    let data = req.body;

    let { status } = data;

    let order = await orderModel.findOne({ _id: orderId });

    if (!order) {
      return res
        .status(404)
        .send({ status: false, message: "Order not found" });
    }

    if (!isValidStatus(status)) {
      return res.status(400).send({
        status: false,
        message: "status should be only - 'pending', 'complete' or 'cancelled'",
      });
    }

    if (order.status === "cancelled") {
      return res
        .status(400)
        .send({ status: false, message: "This order is already cancelled" });
    }

    let orderStatus = await orderModel.findOneAndUpdate(
      { _id: orderId },
      { $set: { status: "cancelled" } },
      { new: true }
    );

    return res
      .status(200)
      .send({ status: true, message: "Order cancelled successfully" });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { createOrder, cancelOrderById };
