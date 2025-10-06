const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { createSkill, listMySkills } = require("../controllers/skillsController");

router.post("/", protect, createSkill);
router.get("/mine", protect, listMySkills);

module.exports = router;


