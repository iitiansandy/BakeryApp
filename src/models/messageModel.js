const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const MessageSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
    },
    recipient: {
      type: String,
    },
    text: {
      type: String,
    },
    file: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", MessageSchema);
