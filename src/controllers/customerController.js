const customerModel = require("../models/customerModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
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
const { isValidObjectId } = require("mongoose");

// ADD CUSTOMER
const signUpCustomer = async (req, res) => {
  try {
    let data = req.body;

    let { name, customerId, email, gender, DOB, mobile, password, address } = data;

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
      customerId,
      DOB,
      email,
      gender,
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
    let { customerId, dialingCode, mobile, HCFToken } = data;

    let customer = await customerModel.findOne({ customerId: customerId, mobile: mobile });

    if (!customer) {
      let loginData = {
        customerId,
        dialingCode,
        mobile,
        HCFToken,
      };

      let newcustomerData = await customerModel.create(loginData);

      return res
        .status(200)
        .send({ status: true, 
          message: "Login successfully",
          loginData: loginData 
        });
    } else {
      return res
        .status(200)
        .send({ status: true, message: "Login successfully",
        loginData: customer
        });
    }

  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};


// UPDATE CUSTOMER
const updateCustomerById = async (req, res) => {
  try {
    let customerId = req.params.customerId;

    let customer = await customerModel.findOne({ customerId: customerId });
    let body = req.body;

    // let { field, updatedData } = body;

    if ("name" in body) {
      customer.name = body.name;
    }

    if ("email" in body) {
      customer.email = body.email;
    }

    if ("gender" in body) {
      customer.gender = body.gender;
    }

    if ("DOB" in body) {
      customer.DOB = body.DOB;
    }

    if ("address" in body) {
      customer.address = body.address;
    }

    await customer.save();

    return res
      .status(200)
      .send({ status: true, message: "success", data: customer });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

// DELETE CUSTOMER BY CUSTOMER ID
const deleteCustomerById = async (req, res) => {
  try {
    let customerId = req.params.customerId;

    if (!isValidObjectId(customerId)) {
      return res
        .status(400)
        .send({ status: false, message: "Invalid customer id" });
    }
    
    let customer = await customerModel.findOne({ _id: customerId });

    if (!customer) {
      return res
        .status(404)
        .send({ status: false, message: "Customer not found" });
    }

    let deleteCustomer = await customerModel.deleteOne({ _id: customerId });
    if (!customer) {
      return res
        .status(404)
        .send({ status: false, message: "Customer already deleted" });
    }

    return res
      .status(200)
      .send({ status: true, message: "customer deleted successfully" });
  } catch (error) {
    return res.status(500).send({ error: "error while verifing OTP" });
  }
};

module.exports = {
  signUpCustomer,
  loginCustomer,
  updateCustomerById,
  deleteCustomerById,
};
