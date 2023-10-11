const express = require('express');
const router = express.Router();

const businessController = require('../controllers/businessController');

router.put("/api/v1/addWorkDetails/:userId/:sessionToken", businessController.addUserWorkDetails);
router.get("/api/v1/getWorkDetails/:userId/:sessionToken", businessController.getUserWorkDetails);
router.post("/api/v1/updateWorkDetails/:userId/:sessionToken/:workId", businessController.updateWorkDetails);
router.delete("/api/v1/deleteWorkDetails/:userId/:sessionToken/:workId", businessController.deleteUserWorkDetails);
router.put("/api/v1/updateCurrentWork/:userId/:sessionToken/:workId", businessController.updateCurrentWorkOfUser);


// UPDATE USER ACCOUNT TYPE
router.put("/api/v1/updateAccountType/:userId/:sessionToken/:accountType", businessController.switchUserAccountType);

// UPDATE USER MODDULE
router.post("/api/v1/updateUserModel/:userId/:sessionToken/:accountType", businessController.updateUserModuleData)

module.exports = router;