const messageModel = require("../models/messageModel");
const userModel = require("../models/userModel");

const getMessagesByUserId = async (req, res) => {
  try {
    let { userId, sessionToken, accountType, recipientId } = req.params;

    let user = await userModel.findOne({ userId: userId });

    if (!user) {
      return res.status(404).send({ status: false, message: "user not found" });
    }

    if (
      user.sessionToken === sessionToken &&
      user.accountType === accountType
    ) {
      console.log(userId, recipientId);
      let messages = await messageModel
        .find({
          sender: { $in: [recipientId, userId] },
          recipient: { $in: [recipientId, userId] },
        })
        .sort({ createdAt: 1 });
      return res
        .status(200)
        .send({
          status: true,
          message: "success",
          isSessionExpired: false,
          data: messages
        });
    } else {
      return res.status(200).send({
        status: true,
        message: "Unauthorized",
        isSessionExpired: true,
      });
    }
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

// GET USER CHAT HISTORY

const saveMessage = async (sender, recipient, text) => {
//   console.log(sender, recipient, text);
  let message = await messageModel.create({ sender, recipient, text });
  console.log('message >>>>>>', message);
};

//

module.exports = { getMessagesByUserId, saveMessage };
