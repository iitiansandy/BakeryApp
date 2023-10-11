// Generate Random numeric ID of given length
function generateRandomID(length) {
    let id = '';
    const digits = '0123456789';
  
    for (let i = 0; i < length-5; i++) {
      const randomIndex = Math.floor(Math.random() * digits.length);
      id += digits[randomIndex];
    }
    id += Date.now().toString().slice(8);
    return id;
}


// Generate Random AlphaNumeric ID of given length
function generateRandomAlphaNumericID(length) {
    let id = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      id += characters[randomIndex];
    }
    return id;
  }
  
module.exports = { generateRandomID, generateRandomAlphaNumericID };



/*
{
	"RootData": {
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

*/