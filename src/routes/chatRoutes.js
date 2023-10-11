const express = require('express');
const router = express.Router();

const chatController = require('../controllers/chatController');

router.post("/api/chat/createChat", chatController.createChat);
router.get("/api/chat/getUserChats/:userId", chatController.userChats);
router.get("/api/chat/findChat/:firstId/:secondId", chatController.findChat);

module.exports = router;