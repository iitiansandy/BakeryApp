const paymentModel = require("../models/paymentModel");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const { razorpayAPIKey, razorpayAPISecret } = require("../middlewares/config");

// Instantiate the Razorpay Instance
var instance = new Razorpay({
  key_id: razorpayAPIKey,
  key_secret: razorpayAPISecret,
});

// CHECKOUT PAYMENT
const checkoutPayment = async (req, res) => {
  try {
    const options = {
      amount: Number(req.body.amount * 100),
      currency: "INR",
      receipt: "order_rcptid_11",
    };

    const order = await instance.orders.create(options);

    return res
      .status(201)
      .send({ status: true, message: "Success", data: order });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

// PAYMENT VERIFICATION
const verifyPayment = async (req, res) => {
  try {
    // let data = req.body;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", razorpayAPISecret)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      let payment = await paymentModel.create({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      });

      // return res.redirect(
      //   `http://localhost:3000/paymentsuccess?reference=${razorpay_payment_id}`
      // );

      return res.status(200).send({ status: true, message: 'Success', data: payment })
    } else {
      res.status(400).send({
        status: false,
        message: false,
      });
    }
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { checkoutPayment, verifyPayment };
