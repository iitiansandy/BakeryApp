const datingModel = require("../models/datingModel");
const userModel = require("../models/userModel");

// ADD DATING MODULE
const addDatingInfo = async (req, res) => {
  try {
    let data = req.body;
    let {
      userId,
      show_me_gender,
      email_address,
      isShow_my_interests,
      looking_for,
      my_interests
    } = data;

    let datingData = {
      userId,
      show_me_gender,
      email_address,
      isShow_my_interests,
      looking_for,
      my_interests
    };

    let newDating = await datingModel.create(datingData);

    return res
      .status(201)
      .send({ status: true, message: "success", data: newDating });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};


// GET ALL 

module.exports = { addDatingInfo };