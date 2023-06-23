const { isValidObjectId } = require("mongoose");
const productModel = require("../models/productModel");
const { isValid, isValidRequestBody, isValidImg } = require("../utils/utils");

// ADD PRODUCT
const addProduct = async (req, res) => {
  try {
    let data = req.body;

    let { title, description, price, productImage, adminId, shopId } = data;

    if (!isValid(title)) {
      return res
        .status(400)
        .send({ status: false, message: "Product title is required" });
    }

    if (!isValid(price)) {
      return res
        .status(400)
        .send({ status: false, message: "Price is required" });
    }

    let productData = {
      title,
      description,
      price,
      productImage,
      adminId,
      shopId
    };

    let product = await productModel.create(productData);

    return res.status(201).send({
      status: false,
      message: "product added successfully",
      data: product,
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

// GET ALL PRODUCTS
const getAllProducts = async (req, res) => {
  try {
    let products = await productModel.find();

    if (!products.length) {
      return res
        .status(404)
        .send({ status: false, message: "No product found" });
    }

    return res.status(200).send({ status: false, data: products });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

// UPDATE PRODUCT BY PRODUCT ID
const updateProductById = async (req, res) => {
  try {
    let productId = req.params.productId;

    if (!isValidObjectId(productId)) {
      return res
        .status(400)
        .send({ status: false, message: "Invalid product id" });
    }

    let product = await productModel.findById(productId);

    if (!product) {
      return res
        .status(404)
        .send({ status: false, message: "Product not found" });
    }

    let body = req.body;

    if (!isValidRequestBody(body)) {
      return res
        .status(400)
        .send({ status: false, message: "Please enter data in request body" });
    }

    if ("title" in body) {
      product.title = body.title;
    }

    if ("description" in body) {
      product.description = body.description;
    }

    if ("price" in body) {
      product.price = body.price;
    }

    if (typeof productImage === "string" || typeof productImage === "object")
      return res
        .status(400)
        .send({ status: false, message: "ProductImg should be of typeFiles" });

    if (files && files.length > 0) {
      if (!isValidImg(files[0].mimetype)) {
        return res.status(400).send({
          status: false,
          message: "Image Should be of JPEG/ JPG/ PNG",
        });
      }
      let uploadedFileURL = await uploadFile(files[0]);
      product.productImage = uploadedFileURL;
    }

    await product.save();

    return res.status(200).send({
      status: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

// DELETE PRODUCT BY PRODUCT ID
const deleteProductById = async (req, res) => {
  try {
    let productId = req.params.productId;

    if (!isValidObjectId(productId)) {
      return res
        .status(400)
        .send({ status: false, message: "Invalid product id" });
    }

    let deleteProduct = await productModel.deleteOne({ _id: productId });

    if (!deleteProduct) {
      return res
        .status(404)
        .send({
          status: false,
          message: "Product not found or already deleted",
        });
    }

    return res
      .status(200)
      .send({ status: true, message: "Product deleted successfully" });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = {
  addProduct,
  getAllProducts,
  updateProductById,
  deleteProductById,
};
