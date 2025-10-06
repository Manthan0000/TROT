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


