const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

// All user routes require authentication
router.use(authMiddleware);

// Search users
router.get("/search", userController.searchUsers);

// Get user by ID
router.get("/:userId", userController.getUserById);

// Get all users (for testing)
router.get("/", userController.getAllUsers);

module.exports = router;

