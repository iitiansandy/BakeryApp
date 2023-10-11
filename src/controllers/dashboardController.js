const userModel = require("../models/userModel");
const datingModel = require("../models/datingModel");
const businessModel = require("../models/businessModel");
const travelModel = require("../models/travelModel");
const travelPartnerModel = require("../models/travelPartnerModel");
const BFFModel = require("../models/BFFModel");
const tripModel = require("../models/tripModel");
const likesModel = require("../models/likeModel");
const { port } = require("../middlewares/config");
const os = require("os");
const likeModel = require("../models/likeModel");
const blockModel = require("../models/blockModel");
const reportModel = require("../models/reportModel");
const reportTripModel = require("../models/reportTripModel");

// CREATE DASHBOARD
const getDashboard = async (req, res) => {
  try {
    let { userId, sessionToken, accountType } = req.params;

    let user = await userModel.findOne({ userId: userId });

    if (!user) {
      return res.status(404).send({ status: false, message: "Unauthorized" });
    }

    if (
      user.sessionToken === sessionToken &&
      user.accountType === accountType
    ) {
      if (user.accountType === "TRAVELING") {
        console.log("dashboard called");
        let userTrips = await tripModel.find({ userId: userId });
        let allTravelPartners = await travelPartnerModel.find({
          userId: userId,
        });

        console.log("dash travel called");
        return res.status(200).send({
          status: true,
          message: "success",
          isSessionExpired: false,
          TripData: userTrips,
          TravelPartnerData: allTravelPartners,
        });
      } else {
        return res.status(200).send({
          status: true,
          message: "success",
          isSessionExpired: false,
        });
      }
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

// GET USER DATA
const getUserData = async (req, res) => {
  try {
    let { userId, sessionToken, accountType } = req.params;

    let user = await userModel.findOne({ userId: userId });
    // console.log(user.name);

    if (!user) {
      return res.status(404).send({ status: false, message: "Unauthorized" });
    }

    if (
      user.sessionToken === sessionToken &&
      accountType === "DATING" &&
      user.accountType === "DATING"
    ) {
      let datingData = await datingModel.findOne({
        userId: user.userId,
      });

      return res.status(200).send({
        status: true,
        message: "success",
        isSessionExpired: false,
        RootData: user,
        ModelData: datingData,
      });
    } else if (
      user.sessionToken === sessionToken &&
      accountType === "BFF" &&
      user.accountType === "BFF"
    ) {
      let BFFData = await BFFModel.findOne({
        userId: user.userId,
      });

      return res.status(200).send({
        status: true,
        message: "success",
        isSessionExpired: false,
        RootData: user,
        ModelData: BFFData,
      });
    } else if (
      user.sessionToken === sessionToken &&
      accountType === "BUSINESS" &&
      user.accountType === "BUSINESS"
    ) {
      let businessData = await businessModel.findOne({
        userId: user.userId,
      });

      return res.status(200).send({
        status: true,
        message: "success",
        isSessionExpired: false,
        RootData: user,
        ModelData: businessData,
      });
    } else if (
      user.sessionToken === sessionToken &&
      accountType === "TRAVELING" &&
      user.accountType === "TRAVELING"
    ) {
      let travelData = await travelModel.findOne({
        userId: user.userId,
      });

      return res.status(200).send({
        status: true,
        message: "success",
        isSessionExpired: false,
        RootData: user,
        ModelData: travelData,
      });
    } else {
      return res.status(200).send({
        status: true,
        message: "session has expired",
        isSessionExpired: true,
      });
    }
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

// UPLOAD USER IMAGE FOR VERIFY USER
const uploadImageForUserVerification = async (req, res) => {
  try {
    let { userId, sessionToken } = req.params;

    let user = await userModel.findOne({ userId: userId });

    if (!user) {
      return res.status(404).send({ status: true, message: "Unauthorized" });
    }

    if (user.sessionToken === sessionToken) {
      if (user.isVerifiedUser === false) {
        let selfPic = req.files.selfPic;
        if (!selfPic) {
          return res.status(400).json({ status: "No image uploaded" });
        }

        let networkInterfaces = os.networkInterfaces();

        // Filter and find the IPv4 address (assuming you want IPv4)
        let ipAddress = Object.values(networkInterfaces)
          .flat()
          .filter((iface) => iface.family === "IPv4" && !iface.internal)
          .map((iface) => iface.address)[0];

        let IPAddress = ipAddress;
        let ImagePath = "/uploads/";

        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const extension = selfPic.name.split(".").pop();
        const filename = uniqueSuffix + "." + extension;

        imageName = filename;
        imagePath = `http://${IPAddress}:${port}${ImagePath}`;
        let filePath = `./${ImagePath}${filename}`;

        let newImage = {
          imageName: filename,
          imagePath: `http://${IPAddress}:${port}${ImagePath}`,
        };

        // console.log(newImage);

        selfPic.mv(filePath, (err) => {
          if (err) {
            console.log(err);
            return res
              .status(400)
              .send({ status: false, message: "Image upload failed" });
          }
        });

        // user.userImages.push(newImage);
        user.accountVerificationImage = newImage;
        user.isVerifiedUser = true;

        await user.save();

        return res.status(200).send({
          status: true,
          message: "verification image uploaded successfully",
          isSessionExpired: false,
          verificationImage: user.accountVerificationImage,
        });
      } else {
        return res.status(200).send({
          status: true,
          message: "user alredy verified",
          isSessionExpired: false,
        });
      }
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

// CARD API
const getCardProfile1 = async (req, res) => {
  try {
    let { userId, sessionToken, accountType } = req.params;

    let { filterData } = req.body;
    // console.log(req.body);

    let user = await userModel.findOne({ userId: userId });

    if (!user) {
      return res.status(404).send({ status: false, message: "user not found" });
    }

    if (user.sessionToken === sessionToken) {
      if (user.accountType === accountType) {
        console.log("get card profile called");

        let users = await userModel.find({ isDeleted: false });

        let BFFSwipeCardArr = [];
        let businessSwipeCardArr = [];
        let datingSwipeCardArr = [];
        let travelingSwipeCardArr = [];

        // console.log("before loop", swipeCardArr);

        for (let i = 0; i < users.length; i++) {
          if (users[i].accountType === "BFF") {
            console.log("BFF called");
            let BFFData = await BFFModel.findOne({ userId: users[i].userId });

            let SwipeCardObj1 = {
              RootData: users[i],
              ModelData: BFFData,
            };

            BFFSwipeCardArr.push(SwipeCardObj1);
          } else if (users[i].accountType === "BUSINESS") {
            console.log("Business called");
            let businessData = await businessModel.findOne({
              userId: users[i].userId,
            });

            let SwipeCardObj2 = {
              RootData: users[i],
              ModelData: businessData,
            };

            businessSwipeCardArr.push(SwipeCardObj2);
          } else if (users[i].accountType === "DATING") {
            console.log("Dating called");
            let datingData = await datingModel.findOne({
              userId: users[i].userId,
            });

            let SwipeCardObj3 = {
              RootData: users[i],
              ModelData: datingData,
            };

            datingSwipeCardArr.push(SwipeCardObj3);
          } else if (users[i].accountType === "TRAVELING") {
            console.log("Traveling called");
            let travelData = await travelModel.findOne({
              userId: users[i].userId,
            });

            let tripData = await tripModel.find({ userId: users[i].userId });

            let randomTripData =
              tripData[Math.floor(Math.random() * tripData.length)];

            let travelPartnerData = await travelPartnerModel.find({
              userId: users[i].userId,
            });

            let randomTravelPartnerData =
              travelPartnerData[
                Math.floor(Math.random() * travelPartnerData.length)
              ];

            let SwipeCardObj4 = {
              RootData: users[i],
              ModelData: travelData,
              TripData: randomTripData ? randomTripData : null,
              TravelPartnerData: randomTravelPartnerData
                ? randomTravelPartnerData
                : null,
            };

            if (randomTripData || randomTravelPartnerData) {
              travelingSwipeCardArr.push(SwipeCardObj4);
            } else {
              continue;
            }

            // if (!randomTripData && !randomTravelPartnerData) {
            //   travelingSwipeCardArr.pop(SwipeCardObj4);
            // }

            // console.log(travelingSwipeCardArr.length);
          } else {
            res.status(200).send({
              status: true,
              message: "please provide correct account type in params",
              isSessionExpired: true,
            });
          }
        }

        if (user.accountType === "BFF" && accountType === "BFF") {
          res.status(200).send({
            status: true,
            message: "success",
            isSessionExpired: false,
            swipeCardData: BFFSwipeCardArr, //.slice(0, 10),
          });
        } else if (
          user.accountType === "BUSINESS" &&
          accountType === "BUSINESS"
        ) {
          res.status(200).send({
            status: true,
            message: "success",
            isSessionExpired: false,
            swipeCardData: businessSwipeCardArr, //.slice(0, 10),
          });
        } else if (user.accountType === "DATING" && accountType === "DATING") {
          res.status(200).send({
            status: true,
            message: "success",
            isSessionExpired: false,
            swipeCardData: datingSwipeCardArr, //.slice(0, 10),
          });
        } else if (
          user.accountType === "TRAVELING" &&
          accountType === "TRAVELING"
        ) {
          res.status(200).send({
            status: true,
            message: "success",
            isSessionExpired: false,
            swipeCardData: travelingSwipeCardArr, //.slice(0, 10),
          });
        } else {
          return res.status(200).send({
            status: true,
            isSessionExpired: true,
            message: "please provide correct user account type in params",
          });
        }
      } else {
        return res.status(200).send({
          status: true,
          isSessionExpired: true,
          message: "please provide correct user account type in params",
        });
      }
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

// CARD API
const getCardProfile = async (req, res) => {
  try {
    let { userId, sessionToken, accountType } = req.params;

    let { filterData } = req.body;
    // console.log(req.body);

    let user = await userModel.findOne({ userId: userId });

    if (!user) {
      return res.status(404).send({ status: false, message: "user not found" });
    }

    if (user.sessionToken === sessionToken) {
      if (user.accountType === accountType) {
        console.log("get card profile api called");

        let users = await userModel.find({ isDeleted: false });

        let BFFSwipeCardArr = [];
        let businessSwipeCardArr = [];
        let datingSwipeCardArr = [];
        let travelingSwipeCardArr = [];

        for (let i = 0; i < users.length; i++) {
          if (users[i].accountType === "BFF") {
            console.log("BFF called");

            let allBFFData = await BFFModel.find({});

            let BFFUserMatchesConditions = true;

            if (
              "BFF_START_RANGE" in req.body &&
              users[i].age < req.body.BFF_START_RANGE
            ) {
              BFFUserMatchesConditions = false;
            }

            if (
              "BFF_END_RANGE" in req.body &&
              users[i].age > req.body.BFF_END_RANGE
            ) {
              BFFUserMatchesConditions = false;
            }

            if (
              "LENGUAGE" in req.body &&
              !users[i].languages.includes(req.body.LENGUAGE)
            ) {
              BFFUserMatchesConditions = false;
            }

            if (
              "VerifiedProfile" in req.body &&
              users[i].isVerifiedUser !== req.body.VerifiedProfile
            ) {
              BFFUserMatchesConditions = false;
            }

            if (
              "BFF_LOOKING_FOR" in req.body &&
              allBFFData[i].looking_for_bff !== req.body.BFF_LOOKING_FOR
            ) {
              BFFUserMatchesConditions = false;
            }

            if (
              "BFF_RELATIONSHIP" in req.body &&
              allBFFData[i].relationship_bff !== req.body.BFF_RELATIONSHIP
            ) {
              BFFUserMatchesConditions = false;
            }

            if (
              "BFF_HAVE_KIDS" in req.body &&
              allBFFData[i].kids_bff !== req.body.BFF_HAVE_KIDS
            ) {
              BFFUserMatchesConditions = false;
            }

            if (
              "BFF_SMOKING" in req.body &&
              allBFFData[i].smoking !== req.body.BFF_SMOKING
            ) {
              BFFUserMatchesConditions = false;
            }

            if (
              "BFF_DRINKING" in req.body &&
              allBFFData[i].drinkingBff !== req.body.BFF_DRINKING
            ) {
              BFFUserMatchesConditions = false;
            }

            if (
              "BFF_EXERCISE" in req.body &&
              allBFFData[i].exercise_bff !== req.body.BFF_EXERCISE
            ) {
              BFFUserMatchesConditions = false;
            }

            if (
              "BFF_NEW_TO_AREA" in req.body &&
              allBFFData[i].new_to_area_bff !== req.body.BFF_NEW_TO_AREA
            ) {
              BFFUserMatchesConditions = false;
            }

            if (
              "BFF_POLITICS" in req.body &&
              allBFFData[i].politics_bff !== req.body.BFF_POLITICS
            ) {
              BFFUserMatchesConditions = false;
            }

            if (
              "BFF_RELIGION" in req.body &&
              allBFFData[i].religion_bff !== req.body.BFF_RELIGION
            ) {
              BFFUserMatchesConditions = false;
            }

            if (
              "BFF_INTERESTS" in req.body &&
              !allBFFData[i].bizzmy_interests.includes(req.body.BFF_INTERESTS)
            ) {
              BFFUserMatchesConditions = false;
            }

            if (BFFUserMatchesConditions) {
              let swipeBFFObj = {
                RootData: users[i],
                ModelData: allBFFData[i],
              };
              BFFSwipeCardArr.push(swipeBFFObj);
            }
          } else if (users[i].accountType === "BUSINESS") {
            console.log("Business called");

            let allBusinessData = await businessModel.find({});

            let businessUserMatchesConditions = true;

            if (
              "LENGUAGE" in req.body &&
              !users[i].languages.includes(req.body.LENGUAGE)
            ) {
              businessUserMatchesConditions = false;
            }

            if (
              "VerifidProfile" in req.body &&
              users[i].isVerifiedUser !== req.body.VerifidProfile
            ) {
              businessUserMatchesConditions = false;
            }

            if (
              "BIZZ_LOOKING_FOR" in req.body &&
              allBusinessData[i].looking_for_bizz !== req.body.BIZZ_LOOKING_FOR
            ) {
              businessUserMatchesConditions = fales;
            }

            if (
              "BIZZ_INDUSTRY" in req.body &&
              allBusinessData[i].industry_bizz !== req.body.BIZZ_INDUSTRY
            ) {
              businessUserMatchesConditions = false;
            }

            if (
              "BIZZ_EXPERIENCE" in req.body &&
              allBusinessData[i].year_of_experience_bizz !==
                req.body.BIZZ_EXPERIENCE
            ) {
              businessUserMatchesConditions = false;
            }

            if (
              "BIZZ_EDUCATION" in req.body &&
              allBusinessData[i].education_bizz !== req.body.BIZZ_EDUCATION
            ) {
              businessUserMatchesConditions = false;
            }

            if (businessUserMatchesConditions) {
              let swipeBusinessObj = {
                RootData: users[i],
                ModelData: allBusinessData[i],
              };
              businessSwipeCardArr.push(swipeBusinessObj);
            }
          } else if (users[i].accountType === "DATING") {
            console.log("Dating called");

            let allDatingData = await datingModel.find({});

            let userMatchesConditions = true;

            if (
              "DATEING_GENDER_MAN" in req.body &&
              users[i].gender !== req.body.DATEING_GENDER_MAN
            ) {
              userMatchesConditions = false;
            }

            if (
              "DATING_GENDER_WOMEN" in req.body &&
              users[i].gender !== req.body.DATING_GENDER_WOMEN
            ) {
              userMatchesConditions = false;
            }

            if (
              "DATING_START_RANGE" in req.body &&
              users[i].age < req.body.DATING_START_RANGE
            ) {
              userMatchesConditions = false;
            }

            if (
              "DATEING_END_RANGE" in req.body &&
              users[i].age > req.body.DATEING_END_RANGE
            ) {
              userMatchesConditions = false;
            }

            if (
              "LENGUAGE" in req.body &&
              !users[i].languages.includes(req.body.LENGUAGE)
            ) {
              userMatchesConditions = false;
            }

            if (
              "VerifidProfile" in req.body &&
              users[i].isVerifiedUser !== req.body.VerifidProfile
            ) {
              userMatchesConditions = false;
            }

            if (
              "DATEING_EXERCISE" in req.body &&
              allDatingData[i].excercise !== req.body.DATEING_EXERCISE
            ) {
              userMatchesConditions = false;
            }

            if (
              "DATEING_COOKING" in req.body &&
              allDatingData[i].cooking !== req.body.DATEING_COOKING
            ) {
              userMatchesConditions = false;
            }

            if (
              "DATEING_PARTY" in req.body &&
              allDatingData[i].partying !== req.body.DATEING_PARTY
            ) {
              userMatchesConditions = false;
            }

            if (
              "DATEING_SMOK" in req.body &&
              allDatingData[i].smoking !== req.body.DATEING_SMOK
            ) {
              userMatchesConditions = false;
            }

            if (
              "DATEING_EATING_HABITS" in req.body &&
              allDatingData[i].eatingHabits !== req.body.DATEING_EATING_HABITS
            ) {
              userMatchesConditions = false;
            }

            if (
              "DATEING_KIDS" in req.body &&
              allDatingData[i].kids !== req.body.DATEING_KIDS
            ) {
              userMatchesConditions = false;
            }

            if (
              "DATEING_STAR_SIGN" in req.body &&
              allDatingData[i].starSign !== req.body.DATEING_STAR_SIGN
            ) {
              userMatchesConditions = false;
            }

            if (
              "DATEING_POLITICS" in req.body &&
              allDatingData[i].politics !== req.body.DATEING_POLITICS
            ) {
              userMatchesConditions = false;
            }

            if (
              "DATEING_RELIGION" in req.body &&
              allDatingData[i].religion !== req.body.DATEING_RELIGION
            ) {
              userMatchesConditions = false;
            }

            if (
              "DATEING_INTERESTS" in req.body &&
              !allDatingData[i].my_interests.includes(
                req.body.DATEING_INTERESTS
              )
            ) {
              userMatchesConditions = false;
            }

            if (userMatchesConditions) {
              let swipeDatingObj = {
                RootData: users[i],
                ModelData: allDatingData[i],
              };
              datingSwipeCardArr.push(swipeDatingObj);
            }
          } else if (users[i].accountType === "TRAVELING") {
            console.log("Traveling called");

            let allTravelData = await travelModel.find({});
            // let allTravelPartnerData = await travelPartnerModel.find({});
            // let allTripData = await tripModel.find({});

            let tripData = await tripModel.find({ userId: users[i].userId });

            let randomTripData =
              tripData[Math.floor(Math.random() * tripData.length)];

            let travelPartnerData = await travelPartnerModel.find({
              userId: users[i].userId,
            });

            let randomTravelPartnerData =
              travelPartnerData[
                Math.floor(Math.random() * travelPartnerData.length)
              ];

            let travelUserMatchesConditions = true;
            if ("TRAVEL_FIND_PARTNER" in req.body && !randomTravelPartnerData) {
              travelUserMatchesConditions = false;
            }

            if (
              "LENGUAGE" in req.body &&
              !users[i].languages.includes(req.body.LENGUAGE)
            ) {
              travelUserMatchesConditions = false;
            }

            if (
              "TRAVEL_DRINKING" in req.body &&
              allTravelData[i].drinkTravel !== req.body.TRAVEL_DRINKING
            ) {
              travelUserMatchesConditions = false;
            }

            if (
              "VerifidProfile" in req.body &&
              users[i].isVerifiedUser !== req.body.VerifidProfile
            ) {
              travelUserMatchesConditions = false;
            }

            if (
              "TRAVEL_SMOK" in req.body &&
              allTravelData[i].smoke_travel !== req.body.TRAVEL_SMOK
            ) {
              travelUserMatchesConditions = false;
            }

            if (
              "TRAVEL_EATING" in req.body &&
              allTravelData[i].eatingHabitsTravel !== req.body.TRAVEL_EATING
            ) {
              travelUserMatchesConditions = false;
            }

            if (
              "TRAVEL_YOUR_NATIONALITY" in req.body &&
              allTravelData[i].nationality !== req.body.TRAVEL_YOUR_NATIONALITY
            ) {
              travelUserMatchesConditions = false;
            }

            if (
              "TRAVEL_TRAVEL_TYPE" in req.body &&
              allTravelData[i].travelType !== req.body.TRAVEL_TRAVEL_TYPE
            ) {
              travelUserMatchesConditions = false;
            }

            if (
              "TRAVEL_INTERESTS_CATEGORIES" in req.body &&
              !allTravelData[i].travel_my_interests.includes(
                req.body.TRAVEL_INTERESTS_CATEGORIES
              )
            ) {
              travelUserMatchesConditions = false;
            }

            if ("TRAVEL_FIND_TRIP" in req.body && !randomTripData) {
              travelUserMatchesConditions = false;
            }

            if (travelUserMatchesConditions) {
              let swipeTravelingObj = {
                RootData: users[i],
                ModelData: allTravelData[i],
                TripData: randomTripData ? randomTripData : null,
                TravelPartnerData: randomTravelPartnerData
                  ? randomTravelPartnerData
                  : null,
              };
              travelingSwipeCardArr.push(swipeTravelingObj);
            }
          } else {
            res.status(200).send({
              status: true,
              message: "please provide correct account type in params",
              isSessionExpired: true,
            });
          }
        }

        if (user.accountType === "BFF" && accountType === "BFF") {
          const uniqueArray1 = [
            ...new Set(BFFSwipeCardArr.map(JSON.stringify)),
          ].map(JSON.parse);

          let charArr1 = uniqueArray1.filter(item => item.RootData.userId !== req.params.userId);

          res.status(200).send({
            status: true,
            message: "success",
            isSessionExpired: false,
            swipeCardData: charArr1, //.slice(0, 10),
          });
        } else if (
          user.accountType === "BUSINESS" &&
          accountType === "BUSINESS"
        ) {
          const uniqueArray2 = [
            ...new Set(businessSwipeCardArr.map(JSON.stringify)),
          ].map(JSON.parse);
          
          let charArr2 = uniqueArray2.filter(item => item.RootData.userId !== req.params.userId);

          res.status(200).send({
            status: true,
            message: "success",
            isSessionExpired: false,
            swipeCardData: charArr2, //.slice(0, 10),
          });
        } else if (user.accountType === "DATING" && accountType === "DATING") {
          // let unique = datingSwipeCardArr.filter(onlyUnique);

          const uniqueArray3 = [
            ...new Set(datingSwipeCardArr.map(JSON.stringify)),
          ].map(JSON.parse);

          let charArr3 = uniqueArray3.filter(item => item.RootData.userId !== req.params.userId);

          res.status(200).send({
            status: true,
            message: "success",
            isSessionExpired: false,
            swipeCardData: charArr3, //.slice(0, 10),
          });
        } else if (
          user.accountType === "TRAVELING" &&
          accountType === "TRAVELING"
        ) {
          const uniqueArray4 = [
            ...new Set(travelingSwipeCardArr.map(JSON.stringify)),
          ].map(JSON.parse);

          let charArr4 = uniqueArray4.filter(item => item.RootData.userId !== req.params.userId);

          res.status(200).send({
            status: true,
            message: "success",
            isSessionExpired: false,
            swipeCardData: charArr4, //.slice(0, 10),
          });
        } else {
          return res.status(200).send({
            status: true,
            isSessionExpired: true,
            message: "please provide correct user account type in params",
          });
        }
      } else {
        return res.status(200).send({
          status: true,
          isSessionExpired: true,
          message: "please provide correct user account type in params",
        });
      }
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

// ADD LIKE / DISLIKE IN A PROFILE
const addLikeDislikeInProfile = async (req, res) => {
  try {
    let { userId, sessionToken, accountType, userProfileId } = req.params;

    let user = await userModel.findOne({ userId: userId, isDeleted: false });

    if (
      user.sessionToken === sessionToken &&
      user.accountType === accountType
    ) {
      let { swipeType, swipAction } = req.body;

      if (!swipAction) {
        return res
          .status(400)
          .send({ status: false, message: "Swipe action is required" });
      }

      let targetUserProfile = await userModel.findOne({
        userId: userProfileId,
        isDeleted: false,
      });

      if (!targetUserProfile) {
        return res
          .status(404)
          .send({ status: false, message: "target user profile not found" });
      }

      if (user.accountType === "BFF") {
        let isSwipExist = await likeModel.findOne({
          userId: userId,
          userProfileId: userProfileId,
          accountType: accountType,
        });

        if (!isSwipExist) {
          let swipObj = {
            userId: userId,
            userProfileId: userProfileId,
            swipeType: swipeType,
            swipAction: swipAction,
            accountType: accountType,
          };

          let swipActivity = await likeModel.create(swipObj);

          // console.log("swipe card api called", swipActivity);

          return res.status(201).send({
            status: true,
            message: "success",
            isSessionExpired: false,
            swipActivity: swipActivity,
          });
        } else {
          isSwipExist.swipeType = swipeType;
          isSwipExist.swipAction = swipAction;

          await isSwipExist.save();

          // console.log("swipe card api else part called", isSwipExist);

          return res.status(200).send({
            status: true,
            message: "success",
            isSessionExpired: false,
            swipActivity: isSwipExist,
          });
        }
      }

      if (user.accountType === "BUSINESS") {
        let isSwipExist = await likeModel.findOne({
          userId: userId,
          userProfileId: userProfileId,
          accountType: accountType,
        });

        if (!isSwipExist) {
          let swipObj = {
            userId: userId,
            userProfileId: userProfileId,
            swipeType: swipeType,
            swipAction: swipAction,
            accountType: accountType,
          };

          let swipActivity = await likeModel.create(swipObj);

          // console.log("swipe card api called", swipActivity);

          return res.status(201).send({
            status: true,
            message: "success",
            isSessionExpired: false,
            swipActivity: swipActivity,
          });
        } else {
          isSwipExist.swipeType = swipeType;
          isSwipExist.swipAction = swipAction;

          await isSwipExist.save();

          // console.log(isSwipExist);

          // console.log("swipe card api else part called", isSwipExist);

          return res.status(200).send({
            status: true,
            message: "success",
            isSessionExpired: false,
            swipActivity: isSwipExist,
          });
        }
      }

      if (user.accountType === "DATING") {
        let isSwipExist = await likeModel.findOne({
          userId: userId,
          userProfileId: userProfileId,
          accountType: accountType,
        });

        if (!isSwipExist) {
          let swipObj = {
            userId: userId,
            userProfileId: userProfileId,
            swipeType: swipeType,
            swipAction: swipAction,
            accountType: accountType,
          };

          let swipActivity = await likeModel.create(swipObj);

          // console.log("swipe card api called", swipActivity);

          return res.status(201).send({
            status: true,
            message: "success",
            isSessionExpired: false,
            swipActivity: swipActivity,
          });
        } else {
          isSwipExist.swipeType = swipeType;
          isSwipExist.swipAction = swipAction;

          await isSwipExist.save();

          // console.log("swipe card api else part called", isSwipExist);

          return res.status(200).send({
            status: true,
            message: "success",
            isSessionExpired: false,
            swipActivity: isSwipExist,
          });
        }
      }

      if (user.accountType === "TRAVELING") {
        let { postType, postId } = req.body;
        let isSwipExist = await likeModel.findOne({
          userId: userId,
          userProfileId: userProfileId,
          accountType: accountType,
          postId: postId,
        });

        if (!isSwipExist) {
          let swipObj = {
            userId: userId,
            postId: postId,
            userProfileId: userProfileId,
            swipeType: swipeType,
            postType: postType,
            swipAction: swipAction,
            accountType: accountType,
          };

          let swipActivity = await likeModel.create(swipObj);

          // console.log("swipe card api called", swipActivity);

          return res.status(201).send({
            status: true,
            message: "success",
            isSessionExpired: false,
            swipActivity: swipActivity,
          });
        } else {
          isSwipExist.postType = postType;
          isSwipExist.swipeType = swipeType;
          isSwipExist.swipAction = swipAction;

          await isSwipExist.save();

          return res.status(200).send({
            status: true,
            message: "success",
            isSessionExpired: false,
            swipActivity: isSwipExist,
          });
        }
      }
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

// GET ALL LIKES OF A USER
const getMatchedDataOfUser = async (req, res) => {
  try {
    let { userId, sessionToken, accountType } = req.params;

    let user = await userModel.findOne({ userId: userId, isDeleted: false });

    if (!user) {
      return res.status(404).send({ status: false, message: "user not found" });
    }

    if (
      user.sessionToken === sessionToken &&
      user.accountType === accountType
    ) {
      if (user.accountType === "DATING") {
        let allDatingLikes = await likeModel.find({
          userProfileId: userId,
          accountType: "DATING",
        });

        let likeDatingUser,
          likeModelData,
          superlikeDatingUser,
          superlikeModelData;

        let likeDatingUserArr = [];

        let superlikeDatingUserArr = [];

        for (let i = 0; i < allDatingLikes.length; i++) {
          if (allDatingLikes[i].swipAction === "LIKE") {
            likeDatingUser = await userModel.findOne({
              userId: allDatingLikes[i].userId,
            });

            likeModelData = await datingModel.findOne({
              userId: likeDatingUser.userId,
            });

            let likeUserObj = {
              RootData: likeDatingUser,
              ModelData: likeModelData,
            };

            likeDatingUserArr.push(likeUserObj);
          } else if (allDatingLikes[i].swipAction === "SUPERLIKE") {
            superlikeDatingUser = await userModel.findOne({
              userId: allDatingLikes[i].userId,
            });

            superlikeModelData = await datingModel.findOne({
              userId: superlikeDatingUser.userId,
            });

            let superlikeUserObj = {
              RootData: superlikeDatingUser,
              ModelData: superlikeModelData,
            };

            superlikeDatingUserArr.push(superlikeUserObj);
          }
        }

        if (likeDatingUser && superlikeDatingUser) {
          return res.status(200).send({
            status: true,
            message: "success",
            isSessionExpired: false,
            LikeData: likeDatingUserArr,
            SuperlikeData: superlikeDatingUserArr,
          });
        } else if (likeDatingUser && !superlikeDatingUser) {
          return res.status(200).send({
            status: true,
            message: "success",
            isSessionExpired: false,
            LikeData: likeDatingUserArr,
          });
        } else {
          return res.status(200).send({
            status: true,
            message: "success",
            isSessionExpired: false,
            SuperlikeData: superlikeDatingUserArr,
          });
        }
      } else if (user.accountType === "BFF") {
        let allBFFLikes = await likeModel.find({
          userProfileId: userId,
          accountType: "BFF",
        });

        let likeBFFUsers,
          likeBFFModelData,
          superlikeBFFUsers,
          superlikeBFFModelData;

        let likeBFFData = [];

        let superlikeBFFData = [];

        for (let i = 0; i < allBFFLikes.length; i++) {
          if (allBFFLikes[i].swipAction === "LIKE") {
            likeBFFUsers = await userModel.findOne({
              userId: allBFFLikes[i].userId,
            });

            likeBFFModelData = await BFFModel.findOne({
              userId: likeBFFUsers.userId,
            });

            let likeBFFObj = {
              RootData: likeBFFUsers,
              ModelData: likeBFFModelData,
            };

            likeBFFData.push(likeBFFObj);
          } else if (allBFFLikes[i].swipAction === "SUPERLIKE") {
            superlikeBFFUsers = await userModel.findOne({
              userId: allBFFLikes[i].userId,
            });

            superlikeBFFModelData = await BFFModel.findOne({
              userId: superlikeBFFUsers.userId,
            });

            let superlikeBFFObj = {
              RootData: superlikeBFFUsers,
              ModelData: superlikeBFFModelData,
            };

            superlikeBFFData.push(superlikeBFFObj);
          }
        }

        if (likeBFFUsers && superlikeBFFUsers) {
          return res.status(200).send({
            status: true,
            message: "success",
            isSessionExpired: false,
            LikeData: likeBFFData,
            SuperlikeData: superlikeBFFData,
          });
        } else if (likeBFFUsers && !superlikeBFFUsers) {
          return res.status(200).send({
            status: true,
            message: "success",
            isSessionExpired: false,
            LikeData: likeBFFData,
          });
        } else {
          return res.status(200).send({
            status: true,
            message: "success",
            isSessionExpired: false,
            SuperlikeData: superlikeBFFData,
          });
        }
      } else if (user.accountType === "BUSINESS") {
        let allBusinessInterests = await likeModel.find({
          userProfileId: userId,
          accountType: "BUSINESS",
        });

        let interestedBusinessUsers,
          interestedBusinessModelData,
          starBusinessUser,
          starBusinessModelData;

        let interestBusinessData = [];
        let starBusinessData = [];

        for (let i = 0; i < allBusinessInterests.length; i++) {
          if (allBusinessInterests[i].swipAction === "INTEREST") {
            interestedBusinessUsers = await userModel.findOne({
              userId: allBusinessInterests[i].userId,
            });

            interestedBusinessModelData = await businessModel.findOne({
              userId: interestedBusinessUsers.userId,
            });

            let interestUserObj = {
              RootData: interestedBusinessUsers,
              ModelData: interestedBusinessModelData,
            };

            interestBusinessData.push(interestUserObj);
          } else if (allBusinessInterests[i].swipAction === "STAR") {
            starBusinessUser = await userModel.findOne({
              userId: allBusinessInterests[i].userId,
            });

            starBusinessModelData = await businessModel.findOne({
              userId: starBusinessUser.userId,
            });

            let startBFFObj = {
              RootData: starBusinessUser,
              ModelData: starBusinessModelData,
            };

            starBusinessData.push(startBFFObj);
          }
        }

        if (interestedBusinessUsers && starBusinessUser) {
          return res.status(200).send({
            status: true,
            message: "success",
            isSessionExpired: false,
            InterestBusinessData: interestBusinessData,
            StarBusinessData: starBusinessData,
          });
        } else if (interestedBusinessUsers && !starBusinessUser) {
          return res.status(200).send({
            status: true,
            message: "success",
            isSessionExpired: false,
            InterestBusinessData: interestBusinessData,
          });
        } else {
          return res.status(200).send({
            status: true,
            message: "success",
            isSessionExpired: false,
            StarBusinessData: starBusinessData,
          });
        }
      }
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

// REPORT USER PROFILE
const reportUserProfile = async (req, res) => {
  try {
    let { userId, sessionToken, accountType, targetUserId } = req.params;
    console.log("userId", userId);

    let user = await userModel.findOne({ userId: userId, isDeleted: false });

    if (!user) {
      return res.status(400).send({ status: false, message: "user not found" });
    }

    if (
      user.sessionToken === sessionToken &&
      user.accountType === accountType
    ) {
      let { questions, feedback } = req.body;
      if (
        user.accountType === "BFF" ||
        user.accountType === "BUSINESS" ||
        user.accountType === "DATING"
      ) {
        let isAlreadyReported = await reportModel.findOne({
          userId: userId,
          targetUserId: targetUserId,
          accountType: accountType,
        });

        console.log("isAlreadyReported: ", isAlreadyReported);

        if (!isAlreadyReported) {
          let reportUserObj = {
            userId: userId,
            accountType: accountType,
            questions,
            feedback,
            targetUserId: targetUserId,
            isReported: true,
          };

          let reportedUser = await reportModel.create(reportUserObj);

          console.log("reportedUser:", reportedUser);

          return res.status(201).send({
            status: true,
            message: "user reported successfully",
            isSessionExpired: false,
            reportedUser: reportedUser,
          });
        } else {
          return res.status(200).send({
            status: true,
            message: "user is already reported by you",
            isSessionExpired: false,
          });
        }
      }

      if (user.accountType === "TRAVELING") {
        let { postType, tripId, travelPartnerId } = req.body;

        // console.log(tripId, targetUserId);

        if ("tripId" in req.body) {
          let tripData = await tripModel.findOne({
            userId: targetUserId,
            _id: tripId,
          });

          // console.log(tripData);

          if (tripData) {
            let isTripAlreadyReportedByCurrentUser =
              await reportTripModel.findOne({
                userId: userId,
                targetUserId: targetUserId,
                postType: postType, //PARTNER, TRIP
                tripId: tripId,
                isReported: true,
              });

            if (!isTripAlreadyReportedByCurrentUser) {
              let reportTripObj = {
                userId: userId,
                accountType: accountType,
                postType: postType,
                questions,
                feedback,
                targetUserId: targetUserId,
                tripId: tripId,
                isReported: true,
              };

              let reportedTrip = await reportTripModel.create(reportTripObj);
              console.log("reportedTrip: ", reportedTrip);

              return res.status(200).send({
                status: true,
                message: "trip post reported successfully",
                isSessionExpired: false,
                reportedTrip: reportedTrip,
              });
            } else {
              return res.status(200).send({
                status: true,
                message: "this trip is already reported by you",
                isSessionExpired: false,
              });
            }
          }
        } else if ("travelPartnerId" in req.body) {
          let travelPartnerData = await travelPartnerModel.findOne({
            userId: targetUserId,
            _id: travelPartnerId,
          });

          if (travelPartnerData) {
            let isTravelPartnerAlreadyReported = await reportTripModel.findOne({
              userId: userId,
              targetUserId: targetUserId,
              postType: postType,
              accountType: accountType,
              isReported: true,
            });

            if (!isTravelPartnerAlreadyReported) {
              let reportTravelPartnerObj = {
                userId: userId,
                accountType: accountType,
                postType: postType,
                questions,
                feedback,
                targetUserId: targetUserId,
                travelPartnerId: travelPartnerId,
                isReported: true,
              };

              let reportedTravelPartner = await reportTripModel.create(
                reportTravelPartnerObj
              );

              console.log("reportedTravelPartner: ", reportedTravelPartner);
              return res.status(201).send({
                status: true,
                message: "travel partner reported successfully",
                isSessionExpired: false,
                reportedTravelPartner: reportedTravelPartner,
              });
            } else {
              return res.status(200).send({
                status: true,
                message: "this travel partner is already reported by you",
                isSessionExpired: false,
              });
            }
          }
        } else {
          let isTravelUserAlreadyReported = await reportModel.findOne({
            userId: userId,
            targetUserId: targetUserId,
            accountType: accountType,
          });

          console.log(
            "isTravelUserAlreadyReported: ",
            isTravelUserAlreadyReported
          );

          if (!isTravelUserAlreadyReported) {
            let reportTravelUserObj = {
              userId: userId,
              accountType: accountType,
              questions,
              feedback,
              targetUserId: targetUserId,
              isReported: true,
            };

            let reportedTravelUser = await reportModel.create(
              reportTravelUserObj
            );

            console.log("reportedTravelUser", reportedTravelUser);

            return res.status(201).send({
              status: true,
              message: "user reported successfully",
              isSessionExpired: false,
              reportedUser: reportedTravelUser,
            });
          } else {
            return res.status(200).send({
              status: true,
              message: "user is already reported by you",
              isSessionExpired: false,
            });
          }
        }
      }
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

// BLOCK USER
const blockUserProfile = async (req, res) => {
  try {
    let { userId, sessionToken, accountType, targetUserId } = req.params;

    let user = await userModel.findOne({ userId: userId, isDeleted: false });

    if (!user) {
      return res.status(404).send({ status: false, message: "user not found" });
    }

    if (
      user.sessionToken === sessionToken &&
      user.accountType === accountType
    ) {
      let { questions, feedback } = req.body;
      let isAlreadyBlocked = await blockModel.findOne({
        userId: userId,
        targetUserId: targetUserId,
        accountType: accountType,
      });

      if (!isAlreadyBlocked) {
        let blockedUserObj = {
          userId: userId,
          accountType: accountType,
          questions,
          feedback,
          targetUserId: targetUserId,
          isBlocked: true,
        };

        let blockedUser = await blockModel.create(blockedUserObj);

        console.log("blockedUser:", blockedUser);

        return res.status(201).send({
          status: true,
          message: "user blocked successfully",
          isSessionExpired: false,
          blockedUser: blockedUser,
        });
      } else {
        return res.status(200).send({
          status: true,
          message: "user is already blocked by you",
          isSessionExpired: false,
        });
      }
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
  getDashboard,
  getUserData,
  uploadImageForUserVerification,
  getCardProfile,
  getCardProfile1,
  addLikeDislikeInProfile,
  getMatchedDataOfUser,
  reportUserProfile,
  blockUserProfile,
};
