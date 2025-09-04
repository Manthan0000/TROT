const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    name: { type: String, required: true, index: true },
    description: { type: String, default: '' },
    level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
    priceCredits: { type: Number, default: 10 },
    createdAt: { type: Date, default: Date.now }
  },
  { versionKey: false }
);

module.exports = mongoose.model('Skill', skillSchema);


