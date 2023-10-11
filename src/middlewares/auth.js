const adminModel = require("../models/adminModel");
const customerModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { tokenSecretKey } = require("./config");
const { isValidObjectId } = require("mongoose");

// AUTHENTICATION
const Authentication = async (req, res, next) => {
  try {
    let tokenWithBearer = req.headers.authorization;

    if (!tokenWithBearer) {
      return res
        .status(400)
        .send({ status: false, message: "token is required" });
    }

    let tokenArray = tokenWithBearer.split(" ");

    let token = tokenArray[1];

    if (!token) {
      return res.status(401).send({ status: false, message: "Invalid token" });
    }

    let decodedToken;

    jwt.verify(token, tokenSecretKey, function (err, decode) {
      if (err) {
        return res.status(400).send({ status: false, message: err.message });
      } else {
        decodedToken = decode;
        let loginUserId = decodedToken.adminId;
        req.adminId = loginUserId;
        next();
      }
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

// AUTHORIZATION
const Authorization = async (req, res, next) => {
  try {
    let tokenId = req.adminId;
    let AdminId = req.params.adminId;

    if (!isValidObjectId(AdminId)) {
      return res
        .status(400)
        .send({ status: false, message: "Invalid admin id" });
    }

    let admin = await adminModel.findById(AdminId);

    if (!admin) {
      return res
        .status(404)
        .send({ status: false, message: "Admin not found" });
    }

    let adminId = admin._id;

    if (adminId.toString() !== tokenId.toString()) {
      return res
        .status(403)
        .send({ status: false, message: "authorization failed" });
    }

    next();
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { Authentication, Authorization }