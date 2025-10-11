const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { createSkill, listMySkills, getSkillsByCategory, getSkillTeachers } = require("../controllers/skillsController");

router.post("/", protect, createSkill);
router.get("/mine", protect, listMySkills);
router.get("/category/:category", getSkillsByCategory);
router.get("/teachers/:skillName", getSkillTeachers);

module.exports = router;


