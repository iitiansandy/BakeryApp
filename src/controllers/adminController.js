const adminModel = require("../models/adminModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { tokenSecretKey } = require("../middlewares/config");

const {
  isValid,
  isValidEmail,
  isValidPrice,
  isValidPassword,
} = require("../utils/utils");

// CREATE ADMIN
const createAdmin = async (req, res) => {
  try {
    let data = req.body;

    let { name, email, businessName, password } = data;

    if (!isValid(name)) {
      return res
        .status(400)
        .send({ status: false, message: "Name is required" });
    }

    if (!isValid(email)) {
      return res
        .status(400)
        .send({ status: false, message: "Email is required" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).send({ status: false, message: "Invalid email" });
    }

    let checkEmailExists = await adminModel.findOne({ email: email });

    if (checkEmailExists) {
      return res.status(400).send({
        status: false,
        message: "This email is already exists, please use a different email",
      });
    }

    if (!isValid(businessName)) {
      return res
        .status(400)
        .send({ status: false, message: "businessName is required" });
    }

    if (!isValid(password)) {
      return res
        .status(400)
        .send({ status: false, message: "password is required" });
    }

    let hashedPassword = await bcrypt.hash(password, 10);

    password = hashedPassword;

    let adminData = {
      name,
      email,
      businessName,
      password,
    };

    let admin = await adminModel.create(adminData);

    return res.status(201).send({
      status: true,
      message: "Admin created successfully",
      data: admin,
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

// ADMIN LOGIN
const loginAdmin = async (req, res) => {
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

    if (!isValidPassword(password)) {
      return res.status(400).send({
        status: false,
        message: `Password must include atleast one special character[@$!%?&], one uppercase, one 
      lowercase, one number and should be mimimum 8 to 15 characters long for Example: Password@123`,
      });
    }

    let admin = await adminModel.findOne({ email: email });

    bcrypt.compare(password, admin.password, function (err, result) {
      if (err) {
        return res.status(400).send({ status: false, message: err.message });
      }

      hasAccess(result);
    });

    function hasAccess(result) {
      if (result) {
        let date = Date.now();
        let issueTime = Math.floor(date / 1000);
        let token = jwt.sign(
          {
            email: admin.email,
            adminId: admin._id.toString(),
            iat: issueTime,
          },
          tokenSecretKey,
          { expiresIn: "24h" }
        );
        data.adminId = admin._id;
        data.token = token;
        res.setHeader("Authorization", "Bearer", token);
        delete data.password;
        return res.status(200).send({
          status: false,
          message: "Successfully loggedin",
          data: data,
        });
      } else {
        return res.status(401).send({ status: false, message: "Login denied" });
      }
    }
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { createAdmin, loginAdmin };
