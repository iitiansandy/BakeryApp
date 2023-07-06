const productModel = require("../models/productModel");
const customerModel = require("../models/customerModel");
const orderModel = require("../models/orderModel");
const shopModel = require("../models/shopModel");
const { isValidObjectId } = require("mongoose");

// CREATE DASHBOARD
const createDashboard = async (req, res) => {
  try {
    let customerId = req.params.customerId;

    let products = await productModel.find({ isDeleted: false });
    let customer = await customerModel.findOne({ customerId: customerId }).select("-password");
    let myOrder = await orderModel.findOne({ customerId: customerId });
    let storeDetails = await shopModel.find();

    return res.status(200).send({
      status: true,
      data: {
        products: products,
        customerDetails: customer,
        myOrder: myOrder,
        storeDetails: storeDetails,
      },
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};


// GET DASHBOARD
const getDashboard = async (req, res) => {
  try {
    let products = await productModel.find({ isDeleted: false });
    let storeDetails = await shopModel.find();
    return res.status(200).send({
      status: true,
      data: {
        products: products,
        storeDetails: storeDetails,
      },
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { createDashboard, getDashboard };