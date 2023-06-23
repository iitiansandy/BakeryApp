const customerModel = require("../models/customerModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
// const chalk = require('chalk');
const axios = require("axios");
const otpGenerator = require("otp-generator");
const { otpVerificationMail } = require("../utils/mail");

const {
  isValid,
  isValidEmail,
  isValidMoblie,
  isValidPassword,
} = require("../utils/utils");
const { tokenSecretKey } = require("../middlewares/config");

// ADD CUSTOMER
const signUpCustomer = async (req, res) => {
  try {
    let data = req.body;

    let { name, email, gender, profileImage, mobile, password, address } = data;

    if (!isValid(name)) {
      return res
        .status(400)
        .send({ status: false, message: "Name is required" });
    }

    if (!isValid(email)) {
      return res
        .status(400)
        .send({ status: false, message: "email is required" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).send({ status: false, message: "Invalid email" });
    }

    let checkEmail = await customerModel.findOne({ email: email });

    if (checkEmail) {
      return res
        .status(400)
        .send({ status: false, message: "This email is already exists" });
    }

    if (!isValid(mobile)) {
      return res
        .status(400)
        .send({ status: false, message: "mobile is required" });
    }

    if (!isValidMoblie(mobile)) {
      return res.status(400).send({ status: false, message: "Invalid mobile" });
    }

    let checkMobile = await customerModel.findOne({ mobile: mobile });

    if (checkMobile) {
      return res.status(400).send({
        status: false,
        message: "This mobile number is already exists",
      });
    }

    if (!isValid(password)) {
      return res
        .status(400)
        .send({ status: false, message: "password is required" });
    }

    if (!isValidPassword(password)) {
      return res.status(400).send({
        status: false,
        message: `Password must include atleast one special character[@$!%?&], one uppercase, one 
            lowercase, one number and should be mimimum 8 to 15 characters long for Example: Password@123`,
      });
    }

    let hashedPassword = await bcrypt.hash(password, 10);

    password = hashedPassword;

    if (!isValid(address)) {
      return res
        .status(400)
        .send({ status: false, message: "Address is required" });
    }

    let customerData = {
      name,
      email,
      gender,
      profileImage,
      mobile,
      password,
      address,
    };

    let customer = await customerModel.create(customerData);

    return res.status(201).send({
      status: true,
      message: "customer signup successfully",
      data: customer,
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

// LOGIN CUSTOMER
const loginCustomer = async (req, res) => {
  try {
    let data = req.body;
    let { email, password } = data;

    if (!isValid(email)) {
      return res
        .status(400)
        .send({ status: false, message: "Email is required" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).send({ status: false, message: "Invalid email" });
    }

    if (!isValid(password)) {
      return res
        .status(400)
        .send({ status: false, message: "password is required" });
    }

    let customer = await customerModel.findOne({ email: email });

    if (!customer) {
      return res
        .status(404)
        .send({ status: false, message: "Customer not found" });
    }

    bcrypt.compare(password, customer.password, function (err, result) {
      if (err) {
        return res.status(400).send({ status: false, message: err.message });
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
          .send({ status: true, message: "Successfully loggedin", data: data });
      } else {
        return res.status(401).send({ status: false, message: "Login failed" });
      }
    }
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

// GENERATE OTP
const generateOTP = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).send({ error: "please provide email and otp" });
    }
    const user = await customerModel.findById(id);

    if (!user) {
      return res.status(401).send({ error: "user does not exits" });
    }
    if (user.email_verified) {
      return res.status(200).send({ msg: "email already verified" });
    }
    const otp = otpGenerator.generate(6, {
      lowerCaseAlphabets: true,
      upperCaseAlphabets: true,
      specialChars: true,
    });
    user.otp = otp;
    await user.save();
    await otpVerificationMail(user.name, user.email, user.otp);
    return res.status(200).send({ msg: "OTP generated" });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

// VERIFY OTP
const verifyOTP = async (req, res) => {
  try {
    const { id, otp } = req.body;

    if (!id || !otp) {
      return res.status(400).send({ error: "please provide email and otp" });
    }
    const user = await customerModel.findById(id);
    console.log(user);
    if (!user) {
      return res.status(401).send({ error: "user does not exits" });
    }
    if (user.email_verified) {
      return res.status(200).send({ msg: "email already verified" });
    }
    if (user.otp != otp) {
      return res.status(401).send({ error: "credintials does not match" });
    }

    user.email_verified = true;
    await user.save();
    return res.status(200).send({ msg: "user verified" });
  } catch (error) {
    return res.status(500).send({ error: "error while verifing OTP" });
  }
};

module.exports = { signUpCustomer, loginCustomer, generateOTP, verifyOTP };
