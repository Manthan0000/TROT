const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const authMiddleware = require("../middleware/authMiddleware");

// All chat routes require authentication
router.use(authMiddleware);

// Send a chat request
router.post("/request", chatController.sendChatRequest);

// Get chat requests for current user
router.get("/requests", chatController.getChatRequests);

// Respond to a chat request (accept/reject)
router.patch("/request/:requestId", chatController.respondToChatRequest);

// Get all chats for current user
router.get("/user/me", chatController.getUserChats);

// Clear all messages in a chat (keep chat) - MUST come before /:chatId/messages
router.delete("/:chatId/messages", chatController.clearChat);

// Get messages for a specific chat
router.get("/:chatId/messages", chatController.getChatMessages);

// Send a message
router.post("/message", chatController.sendMessage);

// Mark messages as read
router.patch("/:chatId/read", chatController.markMessagesAsRead);

// Delete a chat
router.delete("/:chatId", chatController.deleteChat);

module.exports = router;

