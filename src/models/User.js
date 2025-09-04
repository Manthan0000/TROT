const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true },
    bio: { type: String, default: '' },
    avatarUrl: { type: String, default: '' },
    skillsTeach: [{ type: String, index: true }],
    skillsLearn: [{ type: String, index: true }],
    credits: { type: Number, default: 100 },
    createdAt: { type: Date, default: Date.now }
  },
  { versionKey: false }
);

module.exports = mongoose.model('User', userSchema);


