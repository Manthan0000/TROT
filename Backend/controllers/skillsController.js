const Skill = require("../models/Skill");

exports.createSkill = async (req, res) => {
  try {
    const { name, category, description, experience, proofUrl } = req.body || {};

    if (!name || !category) {
      return res.status(400).json({ message: "Name and category are required" });
    }

    const skill = await Skill.create({
      userId: req.user,
      name,
      category,
      description: description || "",
      experience: experience || "",
      proofUrl: proofUrl || "",
    });

    return res.status(201).json(skill);
  } catch (err) {
    return res.status(500).json({ message: err.message || "Failed to create skill" });
  }
};

exports.listMySkills = async (req, res) => {
  try {
    const skills = await Skill.find({ userId: req.user }).sort({ createdAt: -1 });
    return res.json(skills);
  } catch (err) {
    return res.status(500).json({ message: err.message || "Failed to fetch skills" });
  }
};

exports.getSkillsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const skills = await Skill.find({ category }).sort({ createdAt: -1 });
    return res.json(skills);
  } catch (err) {
    return res.status(500).json({ message: err.message || "Failed to fetch skills by category" });
  }
};

exports.getSkillTeachers = async (req, res) => {
  try {
    const { skillName } = req.params;
    const skills = await Skill.find({ name: skillName }).populate('userId', 'name email').sort({ createdAt: -1 });
    return res.json(skills);
  } catch (err) {
    return res.status(500).json({ message: err.message || "Failed to fetch skill teachers" });
  }
};


