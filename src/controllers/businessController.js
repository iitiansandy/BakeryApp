const BFFModel = require("../models/BFFModel");
const businessModel = require("../models/businessModel");
const datingModel = require("../models/datingModel");
const travelModel = require("../models/travelModel");
const userModel = require("../models/userModel");
// const {} = require("../middlewares/config");

// ADD USER WORK DETAILS
const addUserWorkDetails = async (req, res) => {
  try {
    let { userId, sessionToken } = req.params;

    let data = req.body;

    let { title, companyRoIndustry, fromDate, toDate } = data;

    let user = await userModel.findOne({ userId: userId });

    if (!user) {
      return res.status(404).send({ status: true, message: "user not found" });
    }

    if (user.sessionToken === sessionToken) {

      let userWorkData = {
        title,
        companyRoIndustry,
        fromDate,
        toDate
      };

      user.workList.push(userWorkData);

      await user.save();

      return res.status(200).send({
        status: true,
        message: "user work added successfully",
        isSessionExpired: false,
        workList: user.workList
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

// GET USER'S WORK DETAILS
const getUserWorkDetails = async (req, res) => {
  try {
    let { userId, sessionToken } = req.params;

    let user = await userModel.findOne({ userId: userId, isDeleted: false });

    if (!user) {
      return res.status(404).send({ status: false, message: "user not found" });
    }

    if (user.sessionToken === sessionToken) {
      let userWorkDetails = user.workList;

      return res.status(200).send({
        status: true,
        isSessionExpired: false,
        workList: userWorkDetails,
      });
    } else {
      return res.status(200).send({
        status: true,
        message: "Unauthorized",
        isSessionExpired: true,
      });
    }
  } catch (error) {
    return res.status(500).send({ status: false, message: error });
  }
};

// UPDATE USER WORK DETAILS
const updateWorkDetails = async (req, res) => {
  try {
    let { userId, sessionToken, workId } = req.params;

    let user = await userModel.findOne({ userId: userId });
    if (!user) {
      return res.status(404).send({ status: false, message: "user not found" });
    }

    if (user.sessionToken === sessionToken) {
      for (let i = 0; i < user.workList.length; i++) {
        if (workId === user.workList[i]._id.toString()) {
          if ("companyRoIndustry" in req.body) {
            user.workList[i].companyRoIndustry = req.body.companyRoIndustry;
          }

          if ("title" in req.body) {
            user.workList[i].title = req.body.title;
          }

          if ("fromDate" in req.body) {
            user.workList[i].fromDate = req.body.fromDate;
          }

          if ("toDate" in req.body) {
            user.workList[i].toDate = req.body.toDate;
          }

          await user.save();
        }

        return res.status(200).send({
          status: true,
          message: "user work updated successfully",
          isSessionExpired: false,
          workList: user.workList,
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


// UPDATE USER CURRENT WORK
const updateCurrentWorkOfUser = async (req, res) => {
  try {
    let {userId, sessionToken, workId} = req.params;

    let user = await userModel.findOne({ userId: userId, isDeleted: false });

    if (!user) {
      return res.status(404).send({ status: false, message: "user not found" });
    }

    if (user.sessionToken === sessionToken) {
      for (let i = 0; i < user.workList.length; i++) {

        if (user.workList[i]._id.toString() === workId) {
          user.workList[i].isCurrentWork = true;
          await user.save();

        } else {
          user.workList[i].isCurrentWork = false;
          await user.save();
        }
      }

      return res.status(200).send({
        status: true,
        message: "current work updated successfully",
        isSessionExpired: false,
        workList: user.workList,
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
}

// DELETE USER WORK DETAILS
const deleteUserWorkDetails = async (req, res) => {
  try {
    let { userId, sessionToken, workId } = req.params;

    let user = await userModel.findOne({ userId: userId, isDeleted: false });

    if (!user) {
      return res.status(404).send({ status: false, message: "user not found" });
    }

    if (user.sessionToken !== sessionToken) {
      return res.status(200).send({
        status: true,
        message: "Unauthorized",
        isSessionExpired: true,
      });
    }

    for (let i = 0; i < user.workList.length; i++) {
      if (user.workList[i]._id.toString() === workId) {
        let arr = user.workList;
        arr.splice(i, 1);
        user.workList = arr;
        await user.save();
      }
    }

    return res.status(200).send({
      status: true,
      message: "user work deleted successfully",
      isSessionExpired: false,
      workList: user.workList,
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

// SWITCH USER ACCOUNT TYPE
const switchUserAccountType = async (req, res) => {
  try {
    let { userId, sessionToken, accountType } = req.params;

    let { switchAccountType } = req.body;

    let user = await userModel.findOne({ userId: userId });

    if (!user) {
      return res.status(404).send({ status: false, message: "user not found" });
    }

    if (user.sessionToken === sessionToken) {
      if (switchAccountType === "DATING") {
        user.accountType = "DATING";
        await user.save();

        let datingData = await datingModel.findOne({ userId: userId });

        return res.status(200).send({
          status: true,
          message: "account type updated successfully",
          isSessionExpired: false,
          RootData: user,
          ModelData: datingData,
        });
      } else if (switchAccountType === "BUSINESS") {
        user.accountType = "BUSINESS";
        await user.save();

        let businessData = await businessModel.findOne({ userId: userId });
        return res.status(200).send({
          status: true,
          message: "account type updated successfully",
          isSessionExpired: false,
          RootData: user,
          ModelData: businessData,
        });
      } else if (switchAccountType === "BFF") {
        user.accountType = "BFF";
        await user.save();

        let BFFData = await BFFModel.findOne({ userId: userId });
        return res.status(200).send({
          status: true,
          message: "account type updated successfully",
          isSessionExpired: false,
          RootData: user,
          ModelData: BFFData,
        });
      } else {
        user.accountType = "TRAVELING";
        await user.save();

        let travelData = await travelModel.findOne({ userId: userId });
        return res.status(200).send({
          status: true,
          message: "account type updated successfully",
          isSessionExpired: false,
          RootData: user,
          ModelData: travelData,
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

// UPDATE USER'S MODULE DATA BY USERID
const updateUserModuleData = async (req, res) => {
  try {
    let { userId, sessionToken, accountType } = req.params;

    let user = await userModel.findOne({ userId: userId });

    if (!user) {
      return res.status(404).send({ status: false, message: "user not found" });
    }

    if (user.sessionToken === sessionToken) {
      let reqBody = req.body;

      if (user.accountType === "BFF") {
        let BFFData = await BFFModel.findOne({ userId: userId });

        if (!BFFData) {
          return res
            .status(404)
            .send({ status: true, message: "BFF data not found" });
        }
        if ("bizzmy_interests" in reqBody) {
          BFFData.bizzmy_interests = reqBody.bizzmy_interests;
        }

        if ("isBizz_show_my_interests" in reqBody) {
          BFFData.isBizz_show_my_interests = reqBody.isBizz_show_my_interests;
        }

        if ("looking_for_bff" in reqBody) {
          BFFData.looking_for_bff = reqBody.looking_for_bff;
        }

        if ("kids_bff" in reqBody) {
          BFFData.kids_bff = reqBody.kids_bff;
        }

        if ("exercise_bff" in reqBody) {
          BFFData.exercise_bff = reqBody.exercise_bff;
        }

        if ("new_to_area_bff" in reqBody) {
          BFFData.new_to_area_bff = reqBody.new_to_area_bff;
        }

        if ("politics_bff" in reqBody) {
          BFFData.politics_bff = reqBody.politics_bff;
        }

        if ("religion_bff" in reqBody) {
          BFFData.religion_bff = reqBody.religion_bff;
        }

        if ("relationship_bff" in reqBody) {
          BFFData.relationship_bff = reqBody.relationship_bff;
        }

        if ("smoking" in reqBody) {
          BFFData.smoking = reqBody.smoking;
        }

        if ("drinkingBff" in reqBody) {
          BFFData.drinkingBff = reqBody.drinkingBff;
        }

        await BFFData.save();

        return res
          .status(200)
          .send({
            status: true,
            message: "updated successfully",
            isSessionExpired: false,
            modelData: BFFData,
          });
      } else if (accountType === "BUSINESS") {
        let businessData = await businessModel.findOne({ userId: userId });

        if (!businessData) {
          return res
            .status(404)
            .send({ status: true, message: "Business data not found" });
        }

        if ("looking_for_bizz" in reqBody) {
          businessData.looking_for_bizz = reqBody.looking_for_bizz;
        }

        if ("industry_bizz" in reqBody) {
          businessData.industry_bizz = reqBody.industry_bizz;
        }

        if ("year_of_experience_bizz" in reqBody) {
          businessData.year_of_experience_bizz =
            reqBody.year_of_experience_bizz;
        }

        if ("education_bizz" in reqBody) {
          businessData.education_bizz = reqBody.education_bizz;
        }

        await businessData.save();

        return res
        .status(200)
        .send({
          status: true,
          message: "updated successfully",
          isSessionExpired: false,
          modelData: businessData,
        });

      } else if (accountType === 'DATING') {
        let datingData = await datingModel.findOne({ userId: userId });

        // console.log(datingData.looking_for);
        if (!datingData) {
          return res
            .status(404)
            .send({ status: true, message: "Dating data not found" });
        }

        if ("cooking" in reqBody) {
          datingData.cooking = reqBody.cooking;
        }

        if ("eatingHabits" in reqBody) {
          datingData.eatingHabits = reqBody.eatingHabits;
        }

        if ("excercise" in reqBody) {
          datingData.excercise = reqBody.excercise
        }

        if ("height" in reqBody) {
          datingData.height = reqBody.height;
        }

        if ("isShow_my_interests" in reqBody) {
          datingData.isShow_my_interests = reqBody.isShow_my_interests;
        }

        if ("kids" in reqBody) {
          datingData.kids = reqBody.kids;
        }

        if ("looking_for" in reqBody) {
          datingData.looking_for = reqBody.looking_for;
        }

        if ("my_interests" in reqBody) {
          datingData.my_interests = reqBody.my_interests;
        }

        if ("partying" in reqBody) {
          datingData.partying = reqBody.partying;
        }

        if ("politics" in reqBody) {
          datingData.politics = reqBody.politics;
        }

        if("religion" in reqBody) {
          datingData.religion = reqBody.religion;
        }

        if ("smoking" in reqBody) {
          datingData.smoking = reqBody.smoking;
        }

        if ("starSign" in reqBody) {
          datingData.starSign = reqBody.starSign;
        }

        await datingData.save();

        return res
        .status(200)
        .send({
          status: true,
          message: "updated successfully",
          isSessionExpired: false,
          modelData: datingData,
        });
      } else if (accountType === 'TRAVELING') {
        let travelData = await travelModel.findOne({ userId: userId });

        if ("drinkTravel" in reqBody) {
          travelData.drinkTravel = reqBody.drinkTravel;
        }

        if ("eatingHabitsTravel" in reqBody) {
          travelData.eatingHabitsTravel = reqBody.eatingHabitsTravel;
        }

        if ("is_travel_show_my_interests" in reqBody) {
          travelData.is_travel_show_my_interests = reqBody.is_travel_show_my_interests;
        }

        if ("looking_for_travel" in reqBody) {
          travelData.looking_for_travel = reqBody.looking_for_travel;
        }

        if ("religion" in reqBody) {
          travelData.religion = reqBody.religion;
        }

        if ("smoke_travel" in reqBody) {
          travelData.smoke_travel = reqBody.smoke_travel;
        }

        if ("travel_my_interests" in reqBody) {
          travelData.travel_my_interests = reqBody.travel_my_interests;
        }

        if ("nationality" in reqBody) {
          travelData.nationality = reqBody.nationality;
        }

        if ("travelType" in reqBody) {
          travelData.travelType = reqBody.travelType;
        }

        await travelData.save();

        return res
        .status(200)
        .send({
          status: true,
          message: "updated successfully",
          isSessionExpired: false,
          modelData: travelData,
        });        
      } else {
        return res.status(200).send({
          status: true,
          message: "please provide correct account type",
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
  addUserWorkDetails,
  getUserWorkDetails,
  updateWorkDetails,
  updateCurrentWorkOfUser,
  deleteUserWorkDetails,
  switchUserAccountType,
  updateUserModuleData
};
