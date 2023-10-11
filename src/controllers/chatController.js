const chatModel = require("../models/chatModel");
const userModel = require("../models/userModel");

// CREATE CHAT
const createChat = async (req, res) => {
  try {
    const newChat = new chatModel({
      members: [req.body.senderId, req.body.receiverId],
    });
    const result = await newChat.save();
    console.log("chat api called");
    return res
      .status(200)
      .send({ status: true, message: "success", newChat: result });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

// GET USER'S CHATS
const userChats = async (req, res) => {
  try {
    const chats = await chatModel.find({
      members: { $in: [req.params.userId] },
    });
    return res
      .status(200)
      .send({ status: true, message: "success", chats: chats });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

// FIND CHAT
const findChat = async (req, res) => {
  try {
    const chat = await chatModel.findOne({
      members: { $in: [req.params.firstId, req.params.secondId] },
    });
    return res
      .status(200)
      .send({ status: true, message: "success", chat: chat });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = {
  createChat,
  userChats,
  findChat,
};
