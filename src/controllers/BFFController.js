const BFFModel = require("../models/BFFModel");

// ADD BFF INFO
const addBFF = async (req, res) => {
  try {
    let data = req.body;
    let {
      userId,
      bizzmy_interests,
      emailAddress,
      isBizz_show_my_interests,
      looking_for_bff
    } = data;

    

    let BFFData = {
      userId,
      bizzmy_interests,
      emailAddress,
      isBizz_show_my_interests,
      looking_for_bff
    };

    let newBFF = await BFFModel.create(BFFData);
    return res
      .status(201)
      .send({ status: true, message: "success", data: newBFF });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { addBFF };





/*

{
    "email": "sunilcodex@gmail.com",
    "loginType": "LOGIN_BY_GMAIL",
    "userId": "bnsk675t8u9i98sf",
    "userName": "Sunil Kumar"
}

DATING:

{
	"RootData": {
    "userId": "98fdc05594m08d1cd1560h45",
		"DateofBirth": "14-08-1999",
		"gender": "MALE",
		"name": "Sunil",
		"SexualOrientationModelArrayList": "Demisexual",
		"isShow_my_Orientation": "true",
		"isShow_my_gender": "true",
		"accountType": "DATING"
	},
	"ModelData": {
	    "email_address":"sunilcodex@gmail.com",
        "isShow_my_interests":true,
        "looking_for":"looking_for_2",
        "my_interests":["Spotify","Town Festivities","Home Workout","Motorcycling Shisha","Social Development"],
        "showMeGender":"MALE"
	}
}


BUSINESS:

{
	"RootData": {
    "userId": "55fdc05594m08d1cd1990h45",
		"DateofBirth": "15-08-1990",
		"gender": "MALE",
		"name": "Punit",
		"SexualOrientationModelArrayList": "Demisexual",
		"isShow_my_Orientation": "true",
		"isShow_my_gender": "true",
		"accountType": "BUSINESS"
	},
	"ModelData": {
	    "emailAddress":"punit12@gmail.com",
      "looking_for_bizz": "freelancing"
	}
}


TRAVELING:

{
	"RootData": {
    "userId": "44fdc05594m08d1cd1560h45",
		"DateofBirth": "14-08-1999",
		"gender": "MALE",
		"name": "Sunil",
		"SexualOrientationModelArrayList": "Demisexual",
		"isShow_my_Orientation": "true",
		"isShow_my_gender": "true",
		"accountType": "TRAVELING"
	},
	"ModelData": {
	    "emailAddress":"mukesh12@gmail.com",
      "is_travel_show_my_interests":"true",
      "religion": "Hindu",
      "smoke_travel": "",
      "looking_for_travel":"travel partner",
      "travel_my_interests":["Spotify","Town Festivities","Home Workout","Motorcycling Shisha","Social Development"]
	}
}


BFF:

{
	"RootData": {
    "userId": "33fdc05594m08d1cd1560h45",
		"DateofBirth": "15-08-1990",
		"gender": "MALE",
		"name": "Rahul",
		"SexualOrientationModelArrayList": "Demisexual",
		"isShow_my_Orientation": "true",
		"isShow_my_gender": "true",
		"accountType": "BFF"
	},
	"ModelData": {
	    "emailAddress":"rahul12@gmail.com",
        "bizzmy_interests": ["Singing", "Climate Change", "K-Pop", "Motorcycling Shisha", "Gardening"],
        "isBizz_show_my_interests": "true",
        "looking_for_bff": "friendship"
	}
}



{
    "loginType": "LOGIN_BY_PHONE",
    "userId": "77fdc05594m08d1cd1440h45",
    "userName": "john123",
    "mobile": "9988776650",
    "countryCode": "+91"
}

*/