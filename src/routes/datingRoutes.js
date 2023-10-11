const express = require('express');
const router = express.Router();

const datingController = require('../controllers/datingController');

router.post("/api/dating/addinfo", datingController.addDatingInfo);

module.exports = router;