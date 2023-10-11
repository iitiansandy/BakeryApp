const userModel = require("../models/userModel");
const tripModel = require("../models/tripModel");
const travelPartnerModel = require("../models/travelPartnerModel");

// CREATE TRAVEL PARTNER
const createTravelPartner = async (req, res) => {
  try {
    let { userId, sessionToken, accountType } = req.params;

    let user = await userModel.findOne({ userId: userId, isDeleted: false });

    if (user.sessionToken === sessionToken) {
      if (user.accountType === "TRAVELING" && accountType === "TRAVELING") {
        let { journey, leaving_from, going_to, date, gender, interestList } =
          req.body;

        let travelPartnerObj = {
          userId: user.userId,
          journey,
          leaving_from,
          going_to,
          date,
          gender,
          interestList,
        };

        let newTravelPartnerData = await travelPartnerModel.create(
          travelPartnerObj
        );

        console.log("travel partner called");

        return res.status(201).send({
          status: true,
          isSessionExpired: false,
          message: "Travel partner created successfully",
          travelPartnerData: newTravelPartnerData,
        });
      } else {
        return res.status(200).send({
          status: true,
          message: "Unauthorized",
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

// GET ALL TRAVEL PARTNERS
const getAllTravelPartners = async (req, res) => {
  try {
    let { userId, sessionToken, accountType, tripId } = req.params;

    let user = await userModel.findOne({ userId: userId, isDeleted: false });

    if (user.sessionToken === sessionToken) {
      if (user.accountType === "TRAVELING" && accountType === "TRAVELING") {
        let appTripPartners = await travelPartnerModel.find({ userId: userId });

        return res.status(201).send({
          status: true,
          isSessionExpired: false,
          message: "success",
          travelPartnerData: appTripPartners,
        });
      } else {
        return res.status(200).send({
          status: true,
          message: "Unauthorized",
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

// UPDATE TRAVEL PARTNER DATA
const updateTravelPartnerData = async (req, res) => {
  try {
    let { userId, sessionToken, accountType, travelPartnerId } = req.params;

    let user = await userModel.findOne({ userId: userId, isDeleted: false });

    if (!user) {
      return res.status(400).send({ status: false, message: "user not found" });
    }

    if (user.sessionToken === sessionToken) {
      if (user.accountType === "TRAVELING" && accountType === "TRAVELING") {
        let travelPartnerData = await travelPartnerModel.findOne({
          userId: userId,
          _id: travelPartnerId,
        });

        if (!travelPartnerData) {
          return res
            .status(400)
            .send({ status: false, message: "user not found" });
        }

        if ("journey" in req.body) {
          travelPartnerData.journey = req.body.journey;
        }
        
        if ("leaving_from" in req.body) {
          travelPartnerData.leaving_from = req.body.leaving_from;
        }

        if ("going_to" in req.body) {
          travelPartnerData.going_to = req.body.going_to;
        }

        if ("date" in req.body) {
          travelPartnerData.date = req.body.date;
        }

        if ("gender" in req.body) {
          travelPartnerData.gender = req.body.gender;
        }

        if ("interestList" in req.body) {
          travelPartnerData.interestList = req.body.interestList;
        }

        await travelPartnerData.save();

        console.log("travel partner updated");

        return res.status(200).send({
          status: true,
          message: "updated successfully",
          isSessionExpired: false,
          TravelPartnerData: travelPartnerData,
        });
      } else {
        return res.status(200).send({
          status: true,
          message: "Unauthorized",
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

// DELETE TRAVEL PARTNER DATA
const deleteTravelPartnerData = async (req, res) => {
  try {
    let { userId, sessionToken, accountType, travelPartnerId } = req.params;

    let user = await userModel.findOne({userId:userId, isDeleted: false});

    if (!user) {
      return res.status(400).send({ status: false, message: "user not found" });
    }

    if (user.sessionToken === sessionToken) {
      if (user.accountType === "TRAVELING" && accountType === "TRAVELING") {
        let travelPartnerData = await travelPartnerModel.findOne({
          userId: userId,
          _id: travelPartnerId,
        });

        if (!travelPartnerData) {
          return res
            .status(400)
            .send({ status: false, message: "user not found" });
        }

        await travelPartnerModel.deleteOne({
          _id: travelPartnerId,
          userId: userId,
        });

        console.log("travel partner deleted");

        return res.status(200).send({
          status: true,
          message: "deleted successfully",
          isSessionExpired: false,
        });
      } else {
        return res.status(200).send({
          status: true,
          message: "Unauthorized",
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
    console.log("error in api");
    return res.status(500).send({ status: false, message: error.message });
  }
};


module.exports = {
  createTravelPartner,
  getAllTravelPartners,
  updateTravelPartnerData,
  deleteTravelPartnerData,
};
