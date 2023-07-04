const order1Model = require("../models/order1Model");
const productModel = require("../models/productModel");
const customerModel = require("../models/customerModel");
const {
  generateRandomID,
  generateRandomAlphaNumericID,
} = require("../controllers/idGeneratorController");

const cartModel = require("../models/cartModel");
const { isValidObjectId } = require("mongoose");
const { isValidRequestBody, isValidStatus } = require("../utils/utils");

// CREATE ORDER
const newOrder = async (req, res) => {
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
      invoiceNumber: generateRandomID(10),
      invoiceDate: new Date().toLocaleString(),
      customerName,
      deliveryAddress,
      hsn,
      items,
      grandTotal: 0,
      status,
      paymentInfo
    };


    let products = await productModel.find();
  
    for (let i=0; i<items.length; i++) {
      for (let j = 0; j < products.length; j++) {
        if ( items[i].productId === products[j]._id.toString()) {
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

    for (let i=0; i<items.length; i++) {
      orderData.grandTotal += items[i].total;
    }

    orderData.paymentInfo.paymentId = generateRandomID(10).toString();
    orderData.paymentInfo.paymentMode = "COD"
    
    // console.log(typeof num)
    // paymentInfo.paymentId = generateRandomID(10).toString();
    // paymentInfo.paymentMode = "COD";
    
    // console.log(items[0]);
    // console.log(items[0].quantity, products[0].mrp, items[0].quantity * products[0].mrp);
    // console.log(orderData.grandTotal);
    // orderData.grandTotal += items[i].total;
    
    let order = await order1Model.create(orderData);

    return res
      .status(201)
      .send({ status: true, message: "Success", data: order });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};


module.exports = { newOrder };