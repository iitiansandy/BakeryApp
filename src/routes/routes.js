const express = require('express')
const router = express.Router()
const multer = require('multer');
const adminController = require("../controllers/adminController")
const customerController = require('../controllers/customerController');
const productController = require('../controllers/productController');
const cartController = require('../controllers/cartController');
const orderController = require('../controllers/orderController');
const shopController = require('../controllers/shopController');
const order1Controller = require('../controllers/order1Controller');
const imageController = require('../controllers/imageController');
const paymentController = require('../controllers/paymentController');
const userController = require('../controllers/userController');
const ratingController = require('../controllers/ratingController');
// const OTPController = require('../controllers/OPTController');
const testController = require('../controllers/testController');
const upload = multer({ storage: multer.memoryStorage() });


const { Authentication, Authorization } = require('../middlewares/auth')

// ADMIN APIs ->
router.post("/admin", adminController.createAdmin);
router.post("/login", adminController.loginAdmin);

// CUSTOMER APIs
router.post("/customer", customerController.signUpCustomer);
router.post("/logincustomer", customerController.loginCustomer);
router.post("/send-otp", testController.sendOTP);
router.post("/verify-otp", testController.verifyOTP);

// router.post("/loginwithotp", OTPController.loginCustomerWithOTP)

// IMAGE API
router.post("/upload", upload.single('filename'), imageController.uploadImage);


// PRODUCT APIs
router.post("/product", productController.addProduct);
router.get("/products", productController.getAllProducts);
router.put("/product/:productId", productController.updateProductById);
router.delete("/product/:productId", productController.deleteProductById);

// SHOP APIs
router.post("/shop", shopController.createShop)

// CART APIs
router.post("/customer/:customerId/cart", cartController.createCart);
// router.post("/customer/:customerId/addcart", cartController.addtoCart)
router.put("/customer/:customerId/cart", cartController.updateCart);

// ORDER API
router.post( "/customer/:customerId/order", orderController.createOrder );
router.put("/customer/:customerId/order", orderController.cancelOrderById);
router.post("/customer/:customerId/addorder", order1Controller.newOrder);


// RATING API
router.post("/addrating", ratingController.addRating);
router.get("/ratings", ratingController.getAllRatings);


// PAYMENT API
router.post("/customer/:customerId/pay", paymentController.checkoutPayment);
router.post("/customer/:customerId/verifypayment", paymentController.verifyPayment);


// USER API
router.post("/sendotp", userController.userSignup);
router.post("/verifyotp", userController.verifyOTP);

module.exports = router;