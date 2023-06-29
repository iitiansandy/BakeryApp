const orderModel = require("../models/orderModel");
const customerModel = require("../models/customerModel");
const productModel = require("../models/productModel");
const cartModel = require("../models/cartModel");
const { isValidObjectId } = require("mongoose");
const { isValidRequestBody, isValidStatus } = require("../utils/utils");

// CREATE ORDER
const createOrder = async (req, res) => {
  try {
    let customerId = req.params.customerId;

    if (!isValidObjectId(customerId)) {
      return res
        .status(400)
        .send({ status: false, message: "Invalid customer id" });
    }

    let data = req.body;

    if (!isValidRequestBody(data)) {
      return res
        .status(400)
        .send({ status: false, message: "Please enter data in body" });
    }

    let customer = await customerModel.findOne({ _id: customerId });

    if (!customer) {
      return res
        .status(404)
        .send({ status: false, message: "Customer not found" });
    }

    let cart = await cartModel.findOne({ customerId: customerId });

    if (!cart) {
      return res.status(404).send({
        status: false,
        message: "No cart found with this customer id",
      });
    }

    let {
      restaurantName,
      restaurantAddress,
      restaurantGSTIN,
      restaurantFSSAI,
      invoiceNumber,
      invoiceDate,
      customerName,
      deliveryAddress,
      hsn,
      items,
      grandTotal,
      status,
      paymentInfo,
    } = data;

    let {
      productId,
      quantity,
      grossValue,
      discount,
      netValue,
      cgstRate,
      cgstValue,
      sgstRate,
      sgstValue,
      total,
    } = items;

    let { paymentId, paymentMode } = paymentInfo;
    // if (!isValidObjectId(productId)) {
    //   return res
    //     .status(400)
    //     .send({ status: false, message: "Invalid product id" });
    // }

    if (quantity) {
      if (typeof quantity !== "number" || quantity <= 0) {
        return res
          .status(400)
          .send({ status: false, message: "Enter Valid Quantity" });
      }
    }

    let orderData = {
      restaurantName,
      restaurantAddress,
      restaurantGSTIN,
      restaurantFSSAI,
      invoiceNumber,
      invoiceDate: new Date().toLocaleString(),
      customerName,
      deliveryAddress,
      hsn,
      items,
      grandTotal:0,
      status,
      paymentInfo,
    };

    let products = await productModel.find();

    for (let i = 0; i < items.length; i++) {
      for (let j = 0; j < products.length; j++) {
        if (items[i].productId === products[j]._id.toString()) {
          items[i].grossValue = items[i].quantity * products[j].price;
        }
      }

      items[i].netValue = items[i].grossValue - items[i].discount;
      items[i].cgstValue = (items[i].cgstRate / 100) * items[i].netValue;
      items[i].sgstRate = items[i].cgstRate;
      items[i].sgstValue = (items[i].sgstRate / 100) * items[i].netValue;
      items[i].total =
        items[i].netValue + items[i].cgstValue + items[i].sgstValue;
    }

    for (let i=0; i<items.length; i++) {
      orderData.grandTotal += items[i].total;
    }

    orderData.paymentInfo.paymentId = generateRandomID(10).toString();
    orderData.paymentInfo.paymentMode = "COD"

    let order = await orderModel.create(orderData);

    await cartModel.findOneAndUpdate(
      { customerId: customerId },
      { items: [], totalPrice: 0, totalItems: 0 }
    );

    return res
      .status(201)
      .send({ status: true, message: "Success", data: order });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

// UPDATE ORDER
const cancelOrderById = async (req, res) => {
  try {
    let customerId = req.params.customerId;
    if (!isValidObjectId(customerId)) {
      return res
        .status(400)
        .send({ status: false, message: "Invalid customer id" });
    }
    let data = req.body;
    if (!isValidRequestBody(data)) {
      return res
        .status(400)
        .send({ status: false, message: "Please enter data in body" });
    }

    let { status, orderId } = data;

    let customer = await customerModel.findOne({ _id: customerId });

    if (!customer) {
      return res
        .status(404)
        .send({ status: false, message: "Customer not found" });
    }

    if (!isValidObjectId(orderId)) {
      return res
        .status(400)
        .send({ status: false, message: "Invalid order id" });
    }

    let order = await orderModel.findOne({ _id: orderId });

    if (!order) {
      return res
        .status(404)
        .send({ status: false, message: "Order not found" });
    }

    let orderCustomerId = order.customerId.toString();

    if (orderCustomerId !== customerId) {
      return res.status(400).send({
        status: false,
        message: "This order does not belong to this customer",
      });
    }

    if (!isValidStatus(status)) {
      return res.status(400).send({
        status: false,
        message: "status should be only - 'pending', 'complete' or 'cancled'",
      });
    }

    let orderStatus = await orderModel.findOneAndUpdate(
      { _id: orderId },
      { $set: data },
      { new: true }
    );

    await cartModel.findOneAndUpdate(
      { customerId: customerId },
      { $set: {status: "cancelled"} },
      { new: true }
    );

    return res
      .status(200)
      .send({ status: true, message: "Success", data: orderStatus });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { createOrder, cancelOrderById };