const express = require('express')
const router = express.Router();
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
const dashboardController = require('../controllers/dashboardController');
const checkoutCODController = require('../controllers/CODController');
const invoiceController = require('../controllers/invoiceGenerator');
// const testController = require('../controllers/testController');

const { Authentication, Authorization } = require('../middlewares/auth')

// ADMIN APIs ->
router.post("/admin", adminController.createAdmin);
router.post("/login", adminController.loginAdmin);

// CUSTOMER APIs
router.post("/customer", customerController.signUpCustomer);
router.post("/logincustomer", customerController.loginCustomer);
router.get("/customers", Authentication, customerController.getAllCustomers);
router.get("/customer/:customerId", Authentication, customerController.getCustomerById);
router.put("/updatecustomer/:customerId", customerController.updateCustomerById);
router.put("/deleteaccount/:customerId", customerController.deleteCustomerById);

// router.post("/loginwithotp", OTPController.loginCustomerWithOTP)

// IMAGE API
// router.post("/upload", upload.single('filename'), imageController.uploadImage);


// PRODUCT APIs
router.post("/product", Authentication, productController.createProduct);
router.get("/products", productController.getAllProducts);
router.get("/getproduct/:productId", productController.getProductById);
router.put("/product/:productId", Authentication, productController.updateProductById);
router.delete("/product/:productId", Authentication, productController.deleteProductById);

// SHOP APIs
router.post("/shop", shopController.createShop)

// CART APIs
router.post("/customer/:customerId/cart", cartController.createCart);
// router.post("/customer/:customerId/addcart", cartController.addtoCart)
router.put("/customer/:customerId/cart", cartController.updateCart);

// ORDER API
router.post( "/checkout/:customerId", orderController.createOrder );
router.put("/cancelorder/:orderId", orderController.cancelOrderById);
router.put("/order/:orderId", orderController.updateOrderById);
router.get("/orders", Authentication, orderController.getAllOrders);
router.get("/alltimerevenue", Authentication, orderController.getAllTimeRevenue);
router.get("/onedayrevenue/:date?", Authentication, orderController.getOneDayRevenue);



router.post("/customer/:customerId/addorder", order1Controller.createOrder);


// RATING API
router.post("/addrating", ratingController.addRating);
router.get("/ratings", ratingController.getAllRatings);

// DASHBOARD API
router.get("/dashboard/:customerId", dashboardController.createDashboard);
router.get("/dashboard", dashboardController.getDashboard);


// RATING API
router.post("/addrating", ratingController.addRating);
router.get("/ratings/:productId", ratingController.getAllRatings);


// PAYMENT API
router.post("/customer/:customerId/pay", paymentController.checkoutPayment);
router.post("/customer/:customerId/verifypayment", paymentController.verifyPayment);


// INVOICE API
router.post("/invoice", invoiceController.getInvoiceNumber);


// CHECKOUT COD API
router.post("/checkoutcod", checkoutCODController.checkoutCOD);

module.exports = router;