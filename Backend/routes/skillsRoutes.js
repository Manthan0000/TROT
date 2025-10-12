const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { createSkill, listMySkills, getSharedSkillsByCategory, getUsersWithSkill } = require("../controllers/skillsController");

console.log("Loaded skillsRoutes.js");

router.post("/", protect, createSkill);
router.get("/mine", protect, listMySkills);
router.get("/shared/:category", getSharedSkillsByCategory); // No auth needed for shared skills
router.get("/users", getUsersWithSkill); // Get users who have a specific skill

// Debug route (no auth) - use this from device browser to verify connectivity
router.get("/debug", (req, res) => {
	res.json({ ok: true, route: "/api/skills/debug", time: new Date().toISOString() });
});

module.exports = router;


