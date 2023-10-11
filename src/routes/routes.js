const express = require('express')
const router = express.Router();

const userController = require('../controllers/userController');
const imageController = require('../controllers/imageController');
const dashboardController = require('../controllers/dashboardController');
const testController = require('../controllers/testController');
const likeController = require('../controllers/likeController');


// const { upload } = require('../controllers/userController');


const { Authentication, Authorization } = require('../middlewares/auth');


// USER APIs
router.post("/api/v1/user/authentication",  userController.userLogin);
router.post("/api/v1/user/register", userController.registerUser);
router.get("/api/v1/user/getallusers", userController.getAllUsers);
router.get("/api/v1/user", userController.getUserById);
router.post("/api/v1/rootUser/update/:userId/:sessionToken/:accountType", userController.updateUserById);
router.put("/api/v1/imageupdate/:userId/:sessionToken", userController.updateUserImage);
router.delete("/api/v1/picDelete/:userId/:sessionToken/:pickId", userController.deleteUserImage);
router.delete("/api/v1/deleteAccount/:userId/:sessionToken/:accountType", userController.deleteUserById);


// router.post("/api/v1/user/authentication",  userController.userLogin);

router.post("/api/v1/user/auth", testController.login);
router.post("/api/v1/user/reg", testController.register);


// DASHBOARD ROUTE
router.post("/api/v1/dashboard/:userId/:sessionToken/:accountType", dashboardController.getDashboard);
router.post("/api/v1/user/:userId/:sessionToken/:accountType", dashboardController.getUserData);
router.post("/api/v1/userVerification/:userId/:sessionToken", dashboardController.uploadImageForUserVerification)

// GET CARD PROFILE
router.post("/api/v1/getCardProfile/:userId/:sessionToken/:accountType", dashboardController.getCardProfile);
router.post("/api/v1/getCardProfile1/:userId/:sessionToken/:accountType", dashboardController.getCardProfile1);

// ADD LIKE DISLIKE IN A PROFILE
router.post("/api/v1/swipeCard/:userId/:sessionToken/:accountType/:userProfileId", dashboardController.addLikeDislikeInProfile);

// GET ALL LIKES
router.get("/api/v1/matchedData/:userId/:sessionToken/:accountType", dashboardController.getMatchedDataOfUser);

// REPORT A USER
router.post("/api/v1/reportUser/:userId/:sessionToken/:accountType/:targetUserId", dashboardController.reportUserProfile);

// BLOCK A USER
router.post("/api/v1/blockUser/:userId/:sessionToken/:accountType/:targetUserId", dashboardController.blockUserProfile);

// GET CHAT USER LIST
router.get("/api/v1/chatProfileList/:userId/:sessionToken/:accountType", likeController.getChatListOfUser )

// GET TRIP USER CHAT LIST
router.get("/api/v1/chatTripProfileList/:userId/:sessionToken/:accountType/:postType/:tripId", likeController.getTripInterestedUsersData )

// GET TRAVEL PARTNER CHAT LIST
router.get("/api/v1/chatTravelPartnerProfileList/:userId/:sessionToken/:accountType", likeController.getTravelPartnerProfileList);

module.exports = router;