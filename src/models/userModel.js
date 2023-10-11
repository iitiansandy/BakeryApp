const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },

    gender: {
      type: String,
      enum: ["MALE", "FEMALE", "OTHER"],
    },

    DateofBirth: {
      type: String,
    },

    SexualOrientationModelArrayList: [],

    userName: {
      type: String,
      trim: true,
    },

    userId: {
      type: String,
      trim: true,
    },

    sessionToken: {
      type: String,
    },

    email: {
      type: String,
    },

    mobile: {
      type: String,
    },

    age: {
      type: Number,
    },

    bio: {
      type: String,
    },

    blogWebsite: {
      type: String,
    },

    education: {
      type: String,
    },

    facebookUsername: {
      type: String,
    },

    instagramUsername: {
      type: String,
    },

    linkedinUsername: {
      type: String,
    },

    twitterUsername: {
      type: String,
    },

    countryCode: {
      type: String,
    },

    loginType: {
      type: String,
      enum: ["LOGIN_BY_PHONE", "LOGIN_BY_GMAIL", "LOGIN_BY_FACEBOOK"],
    },

    userImages: [
      {
        imageName: {
          type: String,
        },
        imagePath: {
          type: String,
        },
      },
    ],

    accountVerificationImage: {
      imageName: {
        type: String,
      },

      imagePath: {
        type: String,
      },
    },

    accountType: {
      type: String,
      enum: ["DATING", "BFF", "BUSINESS", "TRAVELING"],
    },

    myCitasId: {
      type: String,
    },

    isNewUser: {
      type: Boolean,
      default: true,
    },

    isActiveUser: {
      type: Boolean,
      default: true,
    },

    isVerifiedUser: {
      type: Boolean,
      default: false,
    },

    isShowGender: {
      type: Boolean,
      default: true,
    },

    isShowInterest: {
      type: Boolean,
      default: true,
    },

    isShow_my_Orientation: {
      type: Boolean,
      default: true,
    },

    isShow_my_gender: {
      type: Boolean,
      default: true,
    },

    languages: [],

    latitude: {
      type: String,
    },

    longitude: {
      type: String,
    },

    religion: {
      type: String,
    },

    whatsAppNumber: {
      type: String,
    },

    workList: [
      {
        companyRoIndustry: {
          type: String,
        },
        fromDate: {
          type: String,
        },
        isCurrentWork: {
          type: Boolean,
          default: false,
        },
        title: {
          type: String,
        },
        toDate: {
          type: String,
        },
      },
    ],

    question: [],

    feedback: {
      type: String,
    },

    blockedUsers: [String],

    isDeleted: {
      type: Boolean,
      default: false,
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
