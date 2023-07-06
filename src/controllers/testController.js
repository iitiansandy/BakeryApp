const orderModel = require("../models/orderModel");
const customerModel = require("../models/customerModel");
const productModel = require("../models/productModel");
const cartModel = require("../models/cartModel");
const { isValidObjectId } = require("mongoose");
const { isValidRequestBody, isValidStatus } = require("../utils/utils");
const { generateRandomID } = require("../controllers/idGeneratorController");

// Create a variable to store the last generated date and count
let lastGeneratedDate = null;
let lastInvoiceCount = 0;

// Create a function to generate the invoice number
const generateInvoiceNumber = async () => {
  const brandName = "JB";
  const currentDate = new Date();

  // Check if it's a new date
  if (
    lastGeneratedDate &&
    currentDate.toDateString() !== lastGeneratedDate.toDateString()
  ) {
    // Reset the invoice count
    lastInvoiceCount = 0;
  }

  // Increment the invoice count
  lastInvoiceCount++;

  // Generate the 4-digit integer part
  const integerPart = lastInvoiceCount.toString().padStart(4, "0");

  // Generate the invoice number
  const invoiceNumber = `${brandName}${(currentDate.getMonth() + 1)
    .toString()
    .padStart(2, "0")}${currentDate
    .getDate()
    .toString()
    .padStart(2, "0")}${currentDate.getFullYear()}${integerPart}`;

  // Update the last generated date
  lastGeneratedDate = currentDate;

  return invoiceNumber;
};

// CREATE ORDER
const createOrder = async (req, res) => {
  try {
    let customerId = req.params.customerId;

    // if (!isValidObjectId(customerId)) {
    //   return res
    //     .status(400)
    //     .send({ status: false, message: "Invalid customer id" });
    // }

    let data = req.body;

    if (!isValidRequestBody(data)) {
      return res
        .status(400)
        .send({ status: false, message: "Please enter data in body" });
    }

    let customer = await customerModel.findOne({ customerId: customerId });

    // if (!customer) {
    //   return res
    //     .status(404)
    //     .send({ status: false, message: "Customer not found" });
    // }

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

    if (quantity) {
      if (typeof quantity !== "number" || quantity <= 0) {
        return res
          .status(400)
          .send({ status: false, message: "Enter Valid Quantity" });
      }
    }

    let orderData = {
      customerId: req.body.customerId,
      restaurantName,
      restaurantAddress,
      restaurantGSTIN,
      restaurantFSSAI,
      invoiceNumber: await generateInvoiceNumber(),
      invoiceDate: new Date().toLocaleString(),
      customerName,
      deliveryAddress,
      hsn,
      items,
      grandTotal: 0,
      status,
      paymentInfo,
    };

    let products = await productModel.find();

    for (let i = 0; i < items.length; i++) {
      for (let j = 0; j < products.length; j++) {
        if (items[i].productId === products[j]._id.toString()) {
          items[i].grossValue = items[i].quantity * products[j].mrp;
        }
      }

      items[i].netValue = items[i].grossValue - items[i].discount;
      items[i].cgstValue = (items[i].cgstRate / 100) * items[i].netValue;
      items[i].sgstRate = items[i].cgstRate;
      items[i].sgstValue = (items[i].sgstRate / 100) * items[i].netValue;
      items[i].total =
        items[i].netValue + items[i].cgstValue + items[i].sgstValue;
    }

    for (let i = 0; i < items.length; i++) {
      orderData.grandTotal += items[i].total;
    }

    orderData.paymentInfo.paymentId = generateRandomID(10).toString();
    orderData.paymentInfo.paymentMode = "COD";

    let order = await orderModel.create(orderData);
    return res
      .status(201)
      .send({ status: true, message: "Success", data: order });
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