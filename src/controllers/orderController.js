const orderModel = require("../models/orderModel");
const productModel = require("../models/orderModel");
const customerModel = require("../models/customerModel");
const { isValidRequestBody, isValidStatus } = require("../utils/utils");
const { generateRandomID } = require('../controllers/idGeneratorController');
const { uploadImage } = require('../controllers/imageController');

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
      orderID,
      CGST,
      SGST,
      totalProduct,
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
      status,
      productList,
    } = data;

    let {
      productId,
      MrpTotal,
      SubTotal,
      averageRating,
      cartQty,
      description,
      isVeg,
      mrp,
      name,
      salePrice,
      skuCode,
      totalRatingCount
    } = productList;

    // let { images } = req.files;
    // let img = await uploadImage(images);
    // thumbnail = img.imageURL;

    let orderData = {
      orderID: generateRandomID(10),
      CGST,
      SGST,
      totalProduct,
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
      status,
      customerId: req.body.customerId,
      productList,
    };

    let newOrder = await orderModel.create(orderData);

    // Populate the productId field separately on the created document
    // await newOrder.populate({
    //   path: "productList.productId",
    //   select: "-ratings -averageRating -totalRatingCount -ratingPercentages",
    // });

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
        message: 'status should be only - "Pending", "Approved", "Rejected", "Shipped", "Completed", or "Cancel"',
      });
    }

    if (order.status === "Cancel") {
      return res
        .status(400)
        .send({ status: false, message: "This order is already cancelled" });
    }

    let orderStatus = await orderModel.findOneAndUpdate(
      { _id: orderId },
      { $set: { status: "Cancel" } },
      { new: true }
    );

    return res
      .status(200)
      .send({ status: true, message: "Order cancelled successfully" });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};


// GET ALL ORDERS
const getAllOrders = async (req, res) => {
  try {
    let orders = await orderModel.find();
    if (!orders.length) {
      return res.status(404).send({ status: false, message: 'No order found' })
    }

    return res.status(200).send({ status: true, data: orders })
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
}


// UPDATE ORDER BY ORDERID
const updateOrderById = async (req, res) => {
  try {
    let orderId = req.params.orderId;

    let order = await orderModel.findOne({ _id: orderId });

    if (!order) {
      return res.status(404).send({ status: false, message: 'Order Not found' })
    }

    let body = req.body;

    if ("status" in body) {
      order.status = body.status;
    }

    await order.save();
    return res.status(200).send({ status: true, message: 'Order updated successfully' })
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
}

module.exports = { createOrder, cancelOrderById, getAllOrders, updateOrderById };