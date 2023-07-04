const { isValidObjectId } = require("mongoose");
const productModel = require("../models/productModel");
const ratingModel = require("../models/ratingModel");
const customerModel = require("../models/customerModel");
const { uploadImage } = require('../controllers/imageController');
const { isValid, isValidRequestBody, isValidImg } = require("../utils/utils");

// ADD PRODUCT
const createProduct = async (req, res) => {
  try {
    const {
      skuCode,
      isVeg,
      name,
      description,
      qty,
      salePrice,
      mrp
    } = req.body;

    let { images } = req.files;

    let img = await uploadImage(images);

    thumbnail = img.imageURL;

  
    // Create the product
    const product = await productModel.create({
      skuCode,
      isVeg,
      name,
      description,
      qty,
      salePrice,
      mrp,
      thumbnail,
    });
    
    // Calculate average rating and total rating counts
    const ratings = await ratingModel.aggregate([
      { $match: { productId: product._id } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$customers.rating" },
          totalRatingCount: { $sum: 1 },
        },
      },
    ]);

    const averageRating = ratings.length > 0 ? ratings[0].averageRating : 0;
    const totalRatingCount =
      ratings.length > 0 ? ratings[0].totalRatingCount : 0;

    // Update the averageRating and totalRatingCount fields in the product
    product.averageRating = averageRating;
    product.totalRatingCount = totalRatingCount;
    await product.save();

    // Return the created product with average rating and total rating counts
    res.status(201).json({
      product,
      averageRating,
      totalRatingCount,
    });
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(500).json({ error: "Failed to create product." });
  }
}

// GET ALL PRODUCTS
const getAllProducts = async (req, res) => {
  try {
    let products = await productModel.find({isDeleted: false});

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

    if ("name" in body) {
      product.name = body.name;
    }

    if ("description" in body) {
      product.description = body.description;
    }

    if ("salePrice" in body) {
      product.salePrice = body.salePrice;
    }

    if ("skuCode" in body){
      product.skuCode = body.skuCode
    }

    if ("isVeg" in body) {
      product.isVeg = body.isVeg;
    }

    if ("qty" in body) {
      product.qty = body.qty
    }
    
    if ("mrp" in body) {
      product.mrp = body.mrp
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
      return res.status(404).send({
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
  createProduct,
  getAllProducts,
  updateProductById,
  deleteProductById,
};
