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

    let { name, customerId, email, gender, DOB, mobile, password, address } =
      data;

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

    let customer = await customerModel.findOne({
      customerId: customerId,
      mobile: mobile,
    });

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
        .send({
          status: true,
          message: "Login successfully",
          loginData: loginData,
        });
    } else {
      return res
        .status(200)
        .send({
          status: true,
          message: "Login successfully",
          loginData: customer,
        });
    }
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

// GET ALL CUSTOMERS
const getAllCustomers = async (req, res) => {
  try {
    let customers = await customerModel.find({isDeleted: false});

    // if (!customers.length) {
    //   return res
    //     .status(404)
    //     .send({ status: false, message: "No customer found" });
    // }
    return res.status(200).send({ status: true, data: customers });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

// GET CUSTOMER BY CUSTOMER ID
const getCustomerById = async (req, res) => {
  try {
    let customerId = req.params.customerId;
    let customer = await customerModel.findOne({ customerId: customerId, isDeleted: false });
    if (!customer) {
      return res
        .status(404)
        .send({ status: false, message: "Customer Not found" });
    }

    return res.status(200).send({ status: true, data: customer });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

// UPDATE CUSTOMER
const updateCustomerById = async (req, res) => {
  try {
    let customerId = req.params.customerId;

    let customer = await customerModel.findOne({ customerId: customerId, isDeleted: false });

    if (!customer) {
      return res.status(404).send({ status: false, message: 'Customer Not found'})
    }

    let body = req.body;

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

    let data = req.body;

    let { question, feedback } = data;

    let customer = await customerModel.findOne({ customerId: customerId, isDeleted: false });

    if (!customer) {
      return res
        .status(404)
        .send({ status: false, message: "Customer not found" });
    }

    let deleteCustomer = await customerModel.findOneAndUpdate(
      {
        customerId: customerId,
        isDeleted: false,
      },
      {
        $set: {
          isDeleted: true,
          deletedAt: Date.now(),
          question: question,
          feedback: feedback,
        },
      },
      {
        new: true,
      }
    );
    if (!deleteCustomer) {
      return res
        .status(404)
        .send({ status: false, message: "Customer already deleted" });
    }

    return res
      .status(200)
      .send({
        status: true,
        message: "customer deleted successfully",
        data: data,
      });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = {
  signUpCustomer,
  loginCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomerById,
  deleteCustomerById,
};
