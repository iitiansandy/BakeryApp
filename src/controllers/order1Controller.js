const order1Model = require("../models/order1Model");
const productModel = require("../models/productModel");
const customerModel = require("../models/customerModel");

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
      grandTotal: 0,
      status,
      paymentInfo,
    };

    let products = await productModel.find();
  
    for (let i=0; i<items.length; i++) {
      for (let j = 0; j < products.length; j++) {
        if ( items[i].productId === products[j]._id.toString()) {
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
    
    // console.log(orderData.grandTotal);
    // orderData.grandTotal += items[i].total;
    
    let order = await order1Model.create(orderData);

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

// const newOrder = async (req, res) => {
//     try {
//         const {
//             shippingInfo,
//             orderItems,
//             paymentInfo,
//             itemsPrice,
//             taxPrice,
//             shippingPrice,
//             totalPrice,
//           } = req.body;

//           const order = await order1Model.create({
//             shippingInfo,
//             orderItems,
//             paymentInfo,
//             itemsPrice,
//             taxPrice,
//             shippingPrice,
//             totalPrice,
//             paidAt: Date.now(),
//           });

//           res.status(201).json({
//             success: true,
//             order,
//           });
//     } catch (error) {
//         return res.status(500).send({ status: false, message: error.message })
//     }
// }

// module.exports = { newOrder }

// // Create new Order
// exports.newOrder = catchAsyncErrors(async (req, res, next) => {
//   const {
//     shippingInfo,
//     orderItems,
//     paymentInfo,
//     itemsPrice,
//     taxPrice,
//     shippingPrice,
//     totalPrice,
//   } = req.body;

//   const order = await Order.create({
//     shippingInfo,
//     orderItems,
//     paymentInfo,
//     itemsPrice,
//     taxPrice,
//     shippingPrice,
//     totalPrice,
//     paidAt: Date.now(),
//     user: req.user._id,
//   });

//   res.status(201).json({
//     success: true,
//     order,
//   });
// });

// get Single Order
// exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
//   const order = await Order.findById(req.params.id).populate(
//     "user",
//     "name email"
//   );

//   if (!order) {
//     return next(new ErrorHander("Order not found with this Id", 404));
//   }

//   res.status(200).json({
//     success: true,
//     order,
//   });
// });

// // get logged in user  Orders
// exports.myOrders = catchAsyncErrors(async (req, res, next) => {
//   const orders = await Order.find({ user: req.user._id });

//   res.status(200).json({
//     success: true,
//     orders,
//   });
// });

// // get all Orders -- Admin
// exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
//   const orders = await Order.find();

//   let totalAmount = 0;

//   orders.forEach((order) => {
//     totalAmount += order.totalPrice;
//   });

//   res.status(200).json({
//     success: true,
//     totalAmount,
//     orders,
//   });
// });

// // update Order Status -- Admin
// exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
//   const order = await Order.findById(req.params.id);

//   if (!order) {
//     return next(new ErrorHander("Order not found with this Id", 404));
//   }

//   if (order.orderStatus === "Delivered") {
//     return next(new ErrorHander("You have already delivered this order", 400));
//   }

//   if (req.body.status === "Shipped") {
//     order.orderItems.forEach(async (o) => {
//       await updateStock(o.product, o.quantity);
//     });
//   }
//   order.orderStatus = req.body.status;

//   if (req.body.status === "Delivered") {
//     order.deliveredAt = Date.now();
//   }

//   await order.save({ validateBeforeSave: false });
//   res.status(200).json({
//     success: true,
//   });
// });

// async function updateStock(id, quantity) {
//   const product = await Product.findById(id);

//   product.Stock -= quantity;

//   await product.save({ validateBeforeSave: false });
// }

// // delete Order -- Admin
// exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
//   const order = await Order.findById(req.params.id);

//   if (!order) {
//     return next(new ErrorHander("Order not found with this Id", 404));
//   }

//   await order.remove();

//   res.status(200).json({
//     success: true,
//   });
// });

// data.items.netValue = (grossValue - discount);
    // data.items.cgstValue = (cgstRate/100) * data.items.netValue;
    // data.items.sgstRate = cgstRate;

    // data.items.sgstValue = (data.items.sgstRate/100) * data.items.netValue;
    // data.items.total = (data.items.netValue + data.items.cgstValue + data.items.sgstValue);

module.exports = { newOrder };
