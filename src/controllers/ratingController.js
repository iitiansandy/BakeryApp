const ratingModel = require("../models/ratingModel");
const productModel = require("../models/productModel");
const customerModel = require("../models/customerModel");

const { isValid } = require("../utils/utils");

// ADD RATING
// const addRating = async (req, res) => {
//   try {
//     let data = req.body;

//     let { productId, customers } = data;

//     let { customerId, rating, comment } = customers;

//     let ratingData = {
//       productId,
//       customers
//     };

//     let isRatingExists = await ratingModel.findOne({
//       productId: productId,
//       customerId: customers.customerId,
//     });

//     if (isRatingExists) {
//       return res.status(400).send({
//         status: false,
//         message: "This customer has already given rating to this product",
//       });
//     } else {
//       let newRating = await ratingModel.create(ratingData);

//       return res
//         .status(201)
//         .send({ status: true, message: "success", data: newRating });
//     }
//   } catch (error) {
//     return res.status(500).send({ status: false, message: error.message });
//   }
// };


// CREATE RATING
// Assuming you have the necessary dependencies and models imported

// Add a rating for a product
// async function addRating(req, res) {
//   try {
//     // Extract the rating details from the request body
//     const { productId, customerId, rating, comment } = req.body;

//     // Check if the product and customer exist
//     const product = await productModel.findById(productId);
//     const customer = await customerModel.findById(customerId);
//     // const productRating = await ratingModel.findById(productId);
//     // console.log('Hello example', productRating);

//     if (!product) {
//       return res.status(404).json({ error: "Product not found." });
//     }

//     if (!customer) {
//       return res.status(404).json({ error: "Customer not found." });
//     }

//     // Create the rating object
//     const newRating = {
//       customerId,
//       rating,
//       comment,
//     };

//     // Add the rating to the product's ratings array
//     productRating.ratings.push(newRating);
//     await productRating.save();

//     // Return the updated product with the added rating
//     res.status(200).json(productRating);
//   } catch (error) {
//     // Handle any errors that occur during the process
//     console.error("Error adding rating:", error);
//     res.status(500).json({ error: "Failed to add rating." });
//   }
// }



// ADD OR UPDATE A RATING FOR A PRODUCT
async function addRating(req, res) {
  try {
    const { productId, customerId, name, rating, comment } = req.body;

    // Check if the product and customer exist
    const product = await productModel.findById(productId);
    
    const customer = await customerModel.findOne({customerId: customerId});

    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    if (!customer) {
      return res.status(404).json({ error: "Customer not found." });
    }

    // Check if the customer has already rated the product
    const existingRating = product.ratings.find(
      (rating) => rating.customerId.toString() === customerId
    );

    if (existingRating) {
      // Update the existing rating
      existingRating.name = name;
      existingRating.rating = rating;
      existingRating.comment = comment;
      existingRating.time = new Date().toLocaleString();
    } else {
      // Add a new rating
      let time = new Date().toLocaleString();
      product.ratings.push({ customerId, name, rating, comment, time });
    }

    // Calculate the new average rating and total rating counts
    const ratings = product.ratings;
    const totalRatingCount = ratings.length;
    const sumRatings = ratings.reduce((sum, rating) => sum + rating.rating, 0);
    const averageRating = totalRatingCount > 0 ? sumRatings / totalRatingCount : 0;

    // Update the averageRating and totalRatingCount fields in the product
    product.averageRating = averageRating;
    product.totalRatingCount = totalRatingCount;

    // Count the number of customers who gave ratings of 5, 4, 3, 2, and 1
    // const ratingCounts = {
    //   5: 0,
    //   4: 0,
    //   3: 0,
    //   2: 0,
    //   1: 0,
    // };

    // ratings.forEach((rating) => {
    //   if (rating.rating in ratingCounts) {
    //     ratingCounts[rating.rating]++;
    //   }
    // });

    // Update the ratingCounts field in the product
    // product.ratingCounts = ratingCounts;

    // Calculate the percentage of customers who gave ratings of 5, 4, 3, 2, and 1
    const ratingPercentages = {};

    for (let i = 1; i <= 5; i++) {
      const ratingCount = ratings.filter((rating) => rating.rating === i).length;
      const percentage = (ratingCount / totalRatingCount) * 100 || 0;
      ratingPercentages[i] = percentage;
    }

    // Update the ratingPercentages field in the product
    product.ratingPercentages = ratingPercentages;

    // Save the product
    await product.save();

    res.status(200).json(product);
  } catch (error) {
    console.error("Error adding rating:", error);
    res.status(500).json({ error: "Failed to add rating." });
  }
}


// GET ALL RATINGS
const getAllRatings = async (req, res) => {
  try {
    let productId = req.params.productId;
    let ratings = await ratingModel.find({ productId: productId });

    if (!ratings.length) {
      return res
        .status(404)
        .send({ status: false, message: "No rating found" });
    }

    let averageRating;
    let ratingSum = 0;
    let totalRatingCount;
    for (let i = 0; i < ratings.length; i++) {
      ratingSum += ratings[i].rating;
    }
    averageRating = ratingSum / ratings.length;
    totalRatingCount = ratings.length;
    return res
      .status(200)
      .send({
        status: true,
        data: ratings,
        averageRating: averageRating,
        totalRatingCount: totalRatingCount,
      });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

// GET ALL PRODUCTS WITH RATING
const getAllProductsWithRating = async (req, res) => {
  try {
    let productId = req.params.productId;
    let ratingId = req.params.ratingId;

    let products = await productModel.find().populate("ratingId");
    return res.status(200).send({ status: true, data: products });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { addRating, getAllRatings, getAllProductsWithRating };