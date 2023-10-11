const express = require('express');
const router = express.Router();

const travelController = require('../controllers/travelController');
const tripController = require('../controllers/tripController');

router.post("/api/v1/createTravelTrip/:userId/:sessionToken/:accountType", tripController.addUserTravelDetails);
router.get("/api/v1/getAllTrip/:userId/:sessionToken/:accountType", tripController.getUserAllTrips);
router.post("/api/v1/updateTripData/:userId/:sessionToken/:accountType/:tripId", tripController.updateUserTripData);
router.delete("/api/v1/deleteTripData/:userId/:sessionToken/:accountType/:tripId", tripController.deleteUserTripData);

module.exports = router;