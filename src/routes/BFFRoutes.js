const express = require('express');
const router = express.Router();

const BFFController = require('../controllers/BFFController');

router.post("/api/bff/addinfo", BFFController.addBFF);

module.exports = router;