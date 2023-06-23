const cartModel = require("../models/cartModel");
const customerModel = require("../models/customerModel");
const productModel = require("../models/productModel");
const { isValidObjectId } = require("mongoose");

const { isValid, isValidRequestBody } = require("../utils/utils");

// Add to cart
const createCart = async (req, res) => {
  try {
    let data = req.body;

    if (!isValidRequestBody(data)) {
      return res
        .status(400)
        .send({ status: false, message: "Please enter data in body" });
    }

    const customerId = req.params.customerId;

    if (!isValidObjectId(customerId)) {
      return res
        .status(400)
        .send({ status: false, message: "Invalid customer id" });
    }

    let { cartId, productId, shopId, quantity } = data;

    let customer = await customerModel.findById(customerId);

    if (!customer) {
      return res
        .status(404)
        .send({ status: false, message: "Customer not found" });
    }

    const checkProduct = await productModel.findOne({ _id: productId });

    if (!checkProduct) {
      return res
        .status(404)
        .send({ status: false, message: "Product not found" });
    }

    let cart = await cartModel.findOne({ customerId: customerId });

    if (!cart) {
      cart = await cartModel.create({
        customerId: customerId,
        items: [
          {
            productId: productId,
            quantity: quantity || 1,
          },
        ],
        totalPrice: checkProduct.price * (quantity || 1),
        totalItems: 1,
      });

      return res.status(201).send({
        status: true,
        message: "Cart created successfully",
        data: cart,
      });
    }

    let cartItem = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (cartItem) {
      cartItem.quantity += quantity || 1;
    } else {
      cart.items.push({
        productId: productId,
        quantity: quantity || 1,
      });
    }

    let totalPrice = 0;
    let totalItems = 0;

    for (let item of cart.items) {
      const product = await productModel.findOne({ _id: item.productId });
      if (product) {
        item.price = product.price;
        totalPrice += product.price * item.quantity;
        totalItems += item.quantity;
      }
    }

    cart.totalPrice = totalPrice;
    cart.totalItems = totalItems;

    await cart.save();

    return res
      .status(201)
      .send({ status: true, message: "Success", data: cart });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

// DECREASE PRODUCT QUANTITY
const decrementProductQuantity = async (req, res) => {
  try {
    const productId = req.params.productId;

    if (!isValidObjectId(productId)) {
      return res
        .status(400)
        .send({ status: false, message: "Invalid product ID" });
    }

    let product = await productModel.findById(productId);

    if (!product) {
      return res
        .status(404)
        .send({ status: false, message: "Product not found" });
    }

    if (product.quantity <= 0) {
      return res
        .status(400)
        .send({ status: false, message: "Product is out of stock" });
    }

    product.quantity -= 1;
    product.price = product.basePrice * product.quantity;

    await product.save();

    return res
      .status(200)
      .send({
        status: true,
        message: "Product quantity decremented",
        data: product,
      });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

//<<============================= Update Cart =================================>>//

const updateCart = async function (req, res) {
  try {
    let customerId = req.params.customerId;
    let requestBody = req.body;

    if (!isValidObjectId(customerId)) {
      return res
        .status(400)
        .send({ status: false, message: "Invalid userId in body" });
    }

    let user = await customerModel.findOne({ _id: customerId });
    if (!user) {
      return res
        .status(404)
        .send({ status: false, message: "UserId does not found" });
    }

    const { cartId, productId, removeProduct } = requestBody;

    if (!isValidRequestBody(requestBody)) {
      return res.status(400).send({
        status: false,
        message: "Invalid request parameters. Please provide cart details.",
      });
    }

    //cart

    if (!isValid(cartId))
      return res
        .status(400)
        .send({ status: false, message: "Cart id is required" });

    if (!isValidObjectId(cartId)) {
      return res
        .status(400)
        .send({ status: false, message: "Invalid cartId in body" });
    }

    let cart = await cartModel.findById(cartId);

    if (!cart) {
      return res.status(404).send({ status: false, message: "cart not found" });
    }

    //product
    if (!isValidObjectId(productId)) {
      return res
        .status(400)
        .send({ status: false, message: "Invalid productId in body" });
    }

    let product = await productModel.findOne({
      _id: productId,
      isDeleted: false,
    });

    if (!product) {
      return res
        .status(404)
        .send({ status: false, message: "product not found" });
    }
    // cart;
    //find if products exits in cart
    let isProductinCart = await cartModel.findOne({
      items: { $elemMatch: { productId: productId } },
    });

    if (!isProductinCart) {
      return res.status(404).send({
        status: false,
        message: `This ${productId} product does not found in the cart`,
      });
    }

    if (typeof removeProduct === "undefined") {
      return res.status(400).send({
        status: false,
        message: "please provide 0 or 1",
      });
    }

    //removeProduct validation
    if (!!isNaN(Number(removeProduct))) {
      return res.status(400).send({
        status: false,
        message: `removeProduct should be a valid number either 0 or 1`,
      });
    }

    if (!(removeProduct === 0 || removeProduct === 1)) {
      return res.status(400).send({
        status: false,
        message:
          "removeProduct should be 0 (product is to be removed) or 1(quantity has to be decremented by 1) ",
      });
    }

    let { price } = product;
    let { items, totalPrice, totalItems } = cart;
    let findQuantity = items.find((x) => x.productId.toString() === productId);

    for (i in items) {
      if (items[i].productId.toString() == productId) {
        if (removeProduct === 0) {
          let totalAmount = totalPrice - price * findQuantity.quantity;
          totalItems--;

          const wipeCart = await cartModel.findOneAndUpdate(
            { _id: cartId },
            {
              $pull: { items: { productId: productId } },
              totalPrice: totalAmount,
              totalItems: totalItems,
            },
            { new: true }
          );
          //pull the product from itmes

          return res.status(200).send({
            status: true,
            message: `Success`,
            data: wipeCart,
          });
        }

        if (removeProduct === 1) {
          let totalAmount = totalPrice - price;
          items[i].quantity--;
          totalItems--;

          if (items[i].quantity < 1) {
            const wipeCart = await cartModel.findOneAndUpdate(
              { _id: cartId },
              {
                $pull: { items: { productId: productId } },
                totalPrice: totalAmount,
                totalItems: totalItems,
              },
              { new: true }
            );

            return res.status(200).send({
              status: true,
              message: "Success",
              data: wipeCart,
            });
          }

          let data = await cartModel.findOneAndUpdate(
            { _id: cartId },
            { items: items, totalPrice: totalAmount },
            { new: true }
          );

          return res.status(200).send({
            status: true,
            message: `Success`,
            data: data,
          });
        }
      }
    }
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

//<<============================= Get Cart Details =================================>>//

const getCart = async function (req, res) {
  try {
    let customerId = req.params.customerId;

    //--------------------------Validation Starts---------------------------//
    // validating userid from params
    if (!isValid(customerId)) {
      return res.status(400).send({
        status: false,
        message: "Invalid request parameters. userId is required",
      });
    }
    if (!isValidObjectId(customerId)) {
      return res.status(400).send({
        status: false,
        message: "Invalid request parameters. userId is not valid",
      });
    }
    let user = await customerModel.findOne({ _id: customerId });
    if (!user) {
      return res.status(404).send({
        status: false,
        message: "No such user found. Please register and try again",
      });
    }

    let usercartid = await cartModel.findOne({ customerId: customerId });
    if (!usercartid) {
      return res.status(404).send({
        status: false,
        message: "No such cart found. Please register and try again",
      });
    }

    return res
      .status(200)
      .send({ status: true, message: "Success", data: usercartid });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

//<<============================= Delete Cart  =================================>>//

const deleteCart = async function (req, res) {
  try {
    let customerId = req.params.customerId;

    //--------------------------- ---------------------Validation Starts-------------------------------------//
    // validating userid from params
    if (!isValid(customerId)) {
      return res.status(400).send({
        status: false,
        message: "Invalid request parameters. userId is required",
      });
    }
    if (!isValidObjectId(customerId)) {
      return res.status(400).send({
        status: false,
        message: "Invalid request parameters. userId is not valid",
      });
    }

    let Userdata = await customerModel.findOne({ _id: customerId });
    if (!Userdata) {
      return res.status(404).send({
        status: false,
        message: "No such user exists with this userID",
      });
    }

    let usercart = await cartModel.findOne({ customerId: customerId });
    if (!usercart) {
      return res.status(404).send({
        status: false,
        message: "No such user found. Please register and try again",
      });
    }
    usercart.customerId = customerId;
    usercart.items = [];
    usercart.totalPrice = 0;
    usercart.totalItems = 0;
    usercart.save();

    return res.status(204).send({
      status: true,
      message: "Cart successfully Deleted!",
    });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

module.exports = {
  createCart,
  decrementProductQuantity,
  updateCart,
  getCart,
  deleteCart,
};
