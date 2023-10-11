const allUserChatHistoryModel = require("../models/allUsersChatHistoryModel");
const messageModel = require("../models/messageModel");
const userModel = require("../models/userModel");

// CREATE ALL USERS CHAT HISTORY
const getAllUserChatHistory = async (senderUser, receiverUser) => {
  let chatHistory = await allUserChatHistoryModel.findOne({
    $or: [
      { senderUser: senderUser, receiverUser: receiverUser },
      { senderUser: receiverUser, receiverUser: senderUser },
    ],
  });

  let senderObj = await userModel.findOne({ userId: senderUser });
  let receiverObj = await userModel.findOne({ userId: receiverUser });

  if (!chatHistory) {
    let data = {
      senderUser,
      receiverUser,
      senderUserObjId: senderObj._id,
      receiverUserObjId: receiverObj._id,
    };
    await allUserChatHistoryModel.create(data);
  }
};

module.exports = { getAllUserChatHistory };
