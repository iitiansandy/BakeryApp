const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const likeSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
    },

    userProfileId: {
      type: String,
    },

    swipeType: {
      type: String,
      enum: [
        "LIKE",
        "DISLIKE",
        "SUPERLIKE",
        "SKIP",
        "STAR",
        "INTEREST",
        "JOIN",
        "DECLINE",
      ],
    },

    swipAction: {
      type: String,
    },

    accountType: {
      type: String,
    },

    tripId: {
      type: String,
    },

    travelPartnerId: {
      type: String,
    },

    postType: {
        type: String,
    },

    postId: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Like", likeSchema);
