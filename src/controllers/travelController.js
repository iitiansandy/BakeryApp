const travelModel = require("../models/travelModel");
const userModel = require("../models/userModel");

// ADD TRAVEL INFO
const addTravelInfo = async (req, res) => {
  try {
    let data = req.body;
    let {
      userId,
      emailAddress,
      is_travel_show_my_interests,
      looking_for_travel,
      regilion,
      smoke_travel,
      travel_my_interests,
    } = data;

    let travelData = {  
        userId,
        emailAddress,
        is_travel_show_my_interests,
        looking_for_travel,
        regilion,
        smoke_travel,
        travel_my_interests,
    }

    let newTravelData = await travelModel.create(travelData);

    return res.status(201).send({ status: true, message: 'success', data: newTravelData })
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};


// 

module.exports = { addTravelInfo }
