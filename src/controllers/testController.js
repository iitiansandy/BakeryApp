const express = require("express");
const admin = require("firebase-admin");
const bodyParser = require("body-parser");

// Initialize Firebase Admin SDK
const serviceAccount = require("../middlewares");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
app.use(bodyParser.json());

// Generate and send OTP to the specified phone number
const sendOTP = async (req, res) => {
  try {
    const phoneNumber = req.body.phoneNumber;

    admin
      .auth()
      .generatePhoneAuthCode(phoneNumber)
      .then(async (sessionInfo) => {
        const session = await sessionInfo.sessionInfo;

        // Return the session information to the client
        return res.json({ session });
      })
      .catch((error) => {
        return res.status(500).json({ message: "Failed to send OTP" });
      });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

// Verify the received OTP
const verifyOTP = async (req, res) => {
  try {
    const sessionInfo = req.body.sessionInfo;
    const otp = req.body.otp;

    admin
      .auth()
      .verifySessionCookie(sessionInfo, true)
      .then((decodedClaims) => {
        // Session cookie verified successfully
        return res.json({
          message: "User authenticated successfully.",
          decodedClaims,
        });
      })
      .catch((error) => {
        return res
          .status(401)
          .json({ message: "Invalid OTP or session expired." });
      });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { sendOTP, verifyOTP };

// const express = require("express");
// const admin = require("firebase-admin");
// // const csrf = require("csurf");
// const axios = require("axios");
// const bodyParser = require("body-parser");

// // Initialize Firebase Admin SDK
// const serviceAccount = require("../middlewares/serviceAccountKeys.json");
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// const app = express();
// app.use(bodyParser.json());


// // https://identitytoolkit.googleapis.com/v1/accounts:signInWithPhoneNumber
// // Generate and send OTP to the specified phone number
// const sendOTP = async(req, res) => {
//   try {
//     const phoneNumber = req.body.phoneNumber;

//     const apiUrl = `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${serviceAccount.private_key}`;

//     const data = {
//       requestType: "PHONE_SIGN_IN",
//       phoneNumber: phoneNumber,
//     };

//     await axios
//       .post(apiUrl, data)
//       .then(async(response)=>{
//         // Send the response data to the client
//         return res.json(response.data);
//       })
//       .catch((error) => {
//         return res
//           .status(500)
//           .json({ status: false, message: "Error in sending OTP" });
//       });
//   } catch (error) {
//     return res.status(500).send({ status: false, message: error.message });
//   }
// };

// // Verify the received OTP
// const verifyOTP = async (req, res) => {
//   try {
//     const otp = req.body.otp;

//     const apiUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPhoneNumber?key=${serviceAccount.private_key}`;

//     const data = {
//       code: otp,
//       phoneNumber: req.body.phoneNumber,
//     };

//     await axios
//       .post(apiUrl, data)
//       .then(async (response) => {
//         // User successfully authenticated
//         return res.json(response.data);
//       })
//       .catch(async (error) => {
//         return res.status(401).json({ message: "Invalid OTP." });
//       });
//   } catch (error) {
//     return res.status(500).send({ status: false, message: error.message });
//   }
// };

module.exports = { sendOTP, verifyOTP };