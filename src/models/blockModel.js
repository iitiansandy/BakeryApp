const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const blockUserSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
    },

    accountType: {
      type: String,
    },

    questions: [],

    feedback: {
      type: String,
    },

    targetUserId: {
      type: String,
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BlockedUser", blockUserSchema);
