const shopModel = require('../models/shopModel');
const productModel = require('../models/productModel');


// CREATE SHOP
const createShop = async (req, res) => {
    try {
        let data = req.body;

        let { shopNumber, shopAddress, products } = data;

        
        let shopData = {
            shopNumber, shopAddress, products
        }

        let shop = await shopModel.create(shopData);

        return res.status(201).send({ status: true, message: 'Success', data: shop })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = { createShop }