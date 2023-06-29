const userModel = require("../models/userModel");
const otpModel = require("../models/otpModel");
const customerModel = require('../models/customerModel');

const bcrypt = require("bcrypt");
const _ = require("lodash");
const axios = require("axios");
const otpGenerator = require("otp-generator");
const fast2sms = require("fast-two-sms");

const { accountSid, authToken, smsapikey } = require("../middlewares/config");
// const client = require('twilio')(accountSid, authToken);

const { response } = require("express");
const { Twilio } = require("twilio");

// USER SIGNUP
const userSignup = async (req, res) => {
  try {
    let data = req.body;
    let { mobile } = data;

    let user = await userModel.findOne({ mobile: mobile });

    if (user) {
      return res
        .status(400)
        .send({ status: false, message: "user already registered" });
    }

    let OTP = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    console.log(OTP);

    // let greenwebsms = new URLSearchParams();
    // greenwebsms.append('token', '05fa33c4cb50c35f4a258e85ccf50509');
    // greenwebsms.append('to', `+${mobile}`);
    // greenwebsms.append('message', `bManager verification code ${OTP}`);
    // axios.post('http://api.greenweb.com.bd/api.php', greenwebsms).then((response)=>{
    //     console.log(response.data)
    // });

    let response = await fast2sms.sendMessage({
      authorization: smsapikey,
      message: `your verification code is: ${OTP}`,
      numbers: [`${mobile}`],
    });

    // await client.messages.create({
    //     body: `your verification code is: ${OTP}`,
    //     from: '+919811763158',
    //     to: `${mobile}`
    // })
    // .then(()=>console.log( 'success' ))
    // .catch((err)=>console.log( 'Error: ', err.message ))


    let hashedOTP = await bcrypt.hash(OTP, 10);
    OTP = hashedOTP;

    let otp = new otpModel({ mobile: mobile, otp: OTP });

    let newUser = await otp.save();

    return res
      .status(201)
      .send({ status: true, message: "success", data: newUser, response: response });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

// VERIFY OTP
const verifyOTP = async (req, res) => {
  try {
    let data = req.body;
    let { mobile, OTP } = data;
    let otpHolder = await otpModel.find({
      mobile: mobile,
    });

    if (!otpHolder.length) {
      return res
        .status(404)
        .send({ status: false, message: "You are using an expired OTP" });
    }

    let rightOTPFind = otpHolder[otpHolder.length - 1];

    let validUser = await bcrypt.compare(OTP, rightOTPFind.otp);

    if (rightOTPFind.mobile === mobile && validUser) {
      let user = new userModel(_.pick(data, ["mobile"]));
      let token = user.generateJWT();
      let result = await user.save();
      let otpDelete = await otpModel.deleteMany({
        mobile: rightOTPFind.mobile,
      });

      return res.status(200).send({
        status: true,
        message: "user registered",
        token: token,
        data: result,
      });
    } else {
      return res.status(400).send({ status: false, message: "Invalid OTP" });
    }
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { userSignup, verifyOTP };
