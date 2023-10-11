const express = require('express');
const router = express.Router();
const travelPartnerController = require('../controllers/travelPartnerController');


// CREATE TRAVEL PARTNER FOR A TRIP
router.post("/api/v1/createTravelPartner/:userId/:sessionToken/:accountType", travelPartnerController.createTravelPartner);
router.put("/api/v1/updateTravelPartner/:userId/:sessionToken/:accountType/:travelPartnerId", travelPartnerController.updateTravelPartnerData);
router.delete("/api/v1/deleteTravelPartner/:userId/:sessionToken/:accountType/:travelPartnerId", travelPartnerController.deleteTravelPartnerData);

module.exports = router;