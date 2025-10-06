const mongoose = require("mongoose");

const allowedCategories = [
  "Technical",
  "creative",
  "mentorship",
  "Music and Dance",
  "Primary and Secondary",
  "Competition",
  "more",
  "finance",
  "Hardware",
  "gamming",
];

const skillSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, enum: allowedCategories, required: true },
    description: { type: String, default: "" },
    experience: { type: String, default: "" },
    proofUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Skill", skillSchema);


