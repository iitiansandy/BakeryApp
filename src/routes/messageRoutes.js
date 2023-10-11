const express = require('express');
const router = express.Router();

const messageController = require('../controllers/messageController');

// router.post("/api/message/addMessage", messageController.getMessagesByUserId);
router.get("/api/v1/getChatHistory/:userId/:sessionToken/:accountType/:recipientId", messageController.getMessagesByUserId);

module.exports = router;