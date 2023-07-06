const shopModel = require("../models/shopModel");
const productModel = require("../models/productModel");
const { uploadImage } = require("../controllers/imageController");

// CREATE SHOP
const createShop = async (req, res) => {
  try {
    let data = req.body;

    let { 
        shopNumber, 
        shopAddress,
        helplineNumber, 
        description 
    } = data;

    let { images } = req.files;

    let img = await uploadImage(images);

    banners = img.imageURL;

    let shopData = {
      shopNumber,
      shopAddress,
      banners,
      helplineNumber,
      description
    };

    let shop = await shopModel.create(shopData);

    return res
      .status(201)
      .send({ status: true, message: "Success", data: shop });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};


// GET ALL SHOPS
const getAllShops = async (req, res) => {
  try {
    let shops = await shopModel.find();
    if (!shops.length) {
      return res.status(404).send({ status: false, message: 'No shop found'})
    }

    return res.status(200).send({ status: true, data: shops });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
}

module.exports = { createShop };