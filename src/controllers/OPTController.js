const customerModel = require("../models/customerModel");
const admin = require("firebase-admin");
const otpGenerator = require("otp-generator");
const serviceAccount = require("../middlewares/serviceAccountKeys.json"); // Path to your Firebase service account key JSON file

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://bakery-app-95da7.firebaseapp.com", // Replace with your Firebase project URL
});

const otp = otpGenerator.generate(6, {
  digits: true,
  upperCase: false,
  specialChars: false,
});

const loginCustomerWithOTP = async (req, res) => {
  try {
    let data = req.body;
    // const phoneNumber = data.phoneNumber; // Replace with the user's phone number
    // const verificationCode = data.verificationCode; // Replace with the OTP entered by the user

    let { email, password, phone, verificationCode } = data;

    admin
      .auth()
      .signInWithPhoneNumber(
        phone,
        new admin.auth.RecaptchaVerifier("recaptcha-container")
      )
      .then(async (verificationId) => {
        const credential = admin.auth.PhoneAuthProvider.credential(
          verificationId,
          verificationCode
        );
        // Use the credential to sign in or link the user

        let customer = await customerModel.findOne({ email: email });

        if (!customer) {
          return res
            .status(404)
            .send({ status: false, message: "Customer not found" });
        }

        bcrypt.compare(password, customer.password, function (err, result) {
          if (err) {
            return res
              .status(400)
              .send({ status: false, message: err.message });
          }

          hasAccess(result);
        });

        function hasAccess(result) {
          if (result) {
            let date = Date.now();
            let issuTime = Math.floor(date / 1000);
            let token = jwt.sign(
              {
                email: customer.email,
                customerId: customer._id.toString(),
                iat: issuTime,
              },
              tokenSecretKey,
              { expiresIn: "24h" }
            );

            data.customerId = customer._id;
            data.token = token;
            res.setHeader("Authorization", "Bearer", token);
            return res
              .status(200)
              .send({
                status: true,
                message: "Successfully loggedin",
                data: data,
              });
          } else {
            return res
              .status(401)
              .send({ status: false, message: "Login failed" });
          }
        }
      })
      .catch((error) => {
        // Handle the verification error
        throw error;
      });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = {  };