const BFFModel = require("../models/BFFModel");
const businessModel = require("../models/businessModel");
const datingModel = require("../models/datingModel");
const likeModel = require("../models/likeModel");
const travelModel = require("../models/travelModel");
const travelPartnerModel = require("../models/travelPartnerModel");
const tripModel = require("../models/tripModel");
const userModel = require("../models/userModel");

// GET CHAT LIST OF AN USER
const getChatListOfUser = async (req, res) => {
  try {
    let { userId, sessionToken, accountType } = req.params;
    let user = await userModel.findOne({ userId: userId });

    if (!user) {
      return res.status(404).send({ status: false, message: "user not found" });
    }

    if (
      user.sessionToken === sessionToken &&
      user.accountType === accountType
    ) {
      let chatUsers = await likeModel.find({
        userProfileId: userId,
        accountType: accountType,
        swipAction: {
          $nin: ["DISLIKE", "SKIP"],
        },
      });

      // console.log('user liked by other: ', chatUsers)

      let chatUsersArr = [];
      let chatUsers2 = [];
      for (let i = 0; i < chatUsers.length; i++) {
        chatUsers2 = await likeModel.find({
          userId: chatUsers[i].userProfileId,
          userProfileId: chatUsers[i].userId,
          accountType: accountType,
          swipAction: {
            $nin: ["DISLIKE", "SKIP"],
          },
        });
      }

      // console.log('mutually liked userlist: ', chatUsers2);

      for (let i = 0; i < chatUsers2.length; i++) {
        let rootUser = await userModel.findOne({
          userId: chatUsers2[i].userProfileId,
          isDeleted: false,
        });

        if (user.accountType === "BFF") {
          let BFFModule = await BFFModel.findOne({
            userId: chatUsers2[i].userProfileId,
          });
          let BFFUserObj = {
            RootData: rootUser,
            ModelData: BFFModule,
          };
          chatUsersArr.push(BFFUserObj);
        } else if (user.accountType === "BUSINESS") {
          let businessModule = await businessModel.findOne({
            userId: chatUsers2[i].userProfileId,
          });
          let BusinessObj = {
            RootData: rootUser,
            Modeldata: businessModule,
          };
          chatUsersArr.push(BusinessObj);
        } else if (user.accountType === "DATING") {
          let datingModule = await datingModel.findOne({
            userId: chatUsers2[i].userProfileId,
          });
          let DatingObj = {
            RootData: rootUser,
            ModelData: datingModule,
          };
          chatUsersArr.push(DatingObj);
        } else if (user.accountType === "TRAVELING") {
          let travelModule = await travelModel.findOne({
            userId: chatUsers2[i].userProfileId,
          });
          let TravelObj = {
            RootData: rootUser,
            ModelData: travelModule,
          };
          chatUsersArr.push(TravelObj);
        } else {
          return res.status(200).send({
            status: true,
            isSessionExpired: true,
            message: "please provide correct user account type in params",
          });
        }
      }

      let charArr = chatUsersArr.filter(
        (item) => item.RootData.userId !== req.params.userId
      );
      // console.log('chatArr', charArr.length)
      return res.status(200).send({
        status: true,
        message: "success",
        isSessionExpired: false,
        chatList: charArr, //arr1.filter(item => item !== elementToRemove);
      });
    } else {
      return res.status(200).send({
        status: false,
        message: "Unauthorized",
        isSessionExpired: true,
      });
    }
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

// GET TRIP INTERESTED USERS DATA
const getTripInterestedUsersData = async (req, res) => {
  try {
    let { userId, sessionToken, accountType, tripId, postType } = req.params;

    let user = await userModel.findOne({ userId: userId });

    if (!user) {
      return res.status(400).send({ status: false, message: "user not found" });
    }

    if (
      user.sessionToken === sessionToken &&
      user.accountType === "TRAVELING"
    ) {
      let tripInterestedUsers = await likeModel.find({
        userProfileId: userId,
        accountType: "TRAVELING",
        tripId: tripId,
        postType: postType,
        swipAction: {
          $nin: ["DISLIKE", "SKIP"],
        },
      });

      let tripInterestedUserArr = [];
      for (let i = 0; i < tripInterestedUsers.length; i++) {
        let rootUser = await userModel.findOne({
          userId: tripInterestedUsers[i].userId,
        });

        let travelUser = await travelModel.findOne({
          userId: tripInterestedUsers[i].userId,
        });

        let tripInterestedUserObj = {
          RootData: rootUser,
          ModelData: travelUser,
        };

        tripInterestedUserArr.push(tripInterestedUserObj);
      }

      return res.status(200).send({
        status: true,
        message: "success",
        isSessionExpired: false,
        chatList: tripInterestedUserArr,
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

// GET TRAVEL PARTNER PROFILE LIST
const getTravelPartnerProfileList = async (req, res) => {
  try {
    let { userId, sessionToken, accountType } = req.params;
    let user = await userModel.findOne({ userId: userId });

    if (!user) {
      return res.status(400).send({ status: false, message: "user not found" });
    }

    if (
      user.sessionToken === sessionToken &&
      user.accountType === "TRAVELING"
    ) {
      let travelPartnerInterestedUsers = await likeModel.find({
        userProfileId: userId,
        accountType: "TRAVELING",
        postType: "PARTNER",
        swipAction: {
          $nin: ["DISLIKE", "SKIP"],
        },
      });

      let travelPartnerInterestedUserArr = [];
      for (let i = 0; i < travelPartnerInterestedUsers.length; i++) {
        let rootUser = await userModel.findOne({
          userId: travelPartnerInterestedUsers[i].userId,
        });
        let travelModule = await travelModel.findOne({
          userId: travelPartnerInterestedUsers[i].userId,
        });

        let travelPartnerObj = {
          RootData: rootUser,
          ModelData: travelModule,
        };

        travelPartnerInterestedUserArr.push(travelPartnerObj);
      }

      return res.status(200).send({
        status: true,
        message: "success",
        isSessionExpired: false,
        chatList: travelPartnerInterestedUserArr,
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


module.exports = {
  getChatListOfUser,
  getTripInterestedUsersData,
  getTravelPartnerProfileList,
};
