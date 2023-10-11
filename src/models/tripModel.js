const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const tripSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
    },

    Address: {
      type: String,
    },

    Budget: {
      type: String,
    },

    CoverImage: {
      imageName: {
        type: String,
      },
      imagePath: {
        type: String,
      },
    },

    Date: {
      type: String,
    },

    editViewModelArrayList: [
      {
        Day: {
          type: Number,
        },

        Index: {
          type: Number,
        },

        editType: {
          type: String,
          enum: ["DAY", "TEXT", "IMAGE", "LOCATION"],
        },

        TextData: {
          type: String,
        },

        fileUpload: {
          imageName: {
            type: String,
          },
          imagePath: {
            type: String,
          },
        },

        Location: {
          type: String,
        },
      },
    ],

    tripName: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trip", tripSchema);
