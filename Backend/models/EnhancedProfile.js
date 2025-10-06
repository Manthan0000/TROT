const mongoose = require("mongoose");

const enhancedProfileSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true, 
      unique: true 
    },
    gender: { 
      type: String, 
      enum: ["male", "female", "other"], 
      default: undefined 
    },
    dob: { type: Date },
    role: { 
      type: String, 
      enum: ["student", "professional", "other"], 
      default: "other" 
    },
    phone: { type: String },
    education: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("EnhancedProfile", enhancedProfileSchema);
