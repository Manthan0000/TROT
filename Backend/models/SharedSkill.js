const mongoose = require("mongoose");

const sharedSkillSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true, 
      trim: true,
      unique: true // Ensure skill names are unique across all users
    },
    category: { 
      type: String, 
      enum: [
        "Technical",
        "Creative", 
        "Mentorship",
        "Music and Dance",
        "Primary and Secondary",
        "Competition",
        "More",
        "Finance",
        "Hardware",
        "Gaming",
      ], 
      required: true 
    },
    description: { type: String, default: "" },
    addedBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    usageCount: { type: Number, default: 1 }, // Track how many users have this skill
  },
  { timestamps: true }
);

// Index for efficient category-based queries
sharedSkillSchema.index({ category: 1, name: 1 });

module.exports = mongoose.model("SharedSkill", sharedSkillSchema);
