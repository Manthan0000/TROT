const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { updateSettings, updateEnhancedProfile, getEnhancedProfile } = require("../controllers/settingsController");

router.put("/", protect, updateSettings);
router.put("/enhanced", protect, updateEnhancedProfile);
router.get("/enhanced", protect, getEnhancedProfile);

module.exports = router;


