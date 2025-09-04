const express = require('express');
const jwt = require('jsonwebtoken');
const { appConfig } = require('../config');
const Skill = require('../models/Skill');

const router = express.Router();

function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'No token' });
  try {
    const payload = jwt.verify(token, appConfig.jwtSecret);
    req.userId = payload.id;
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

router.post('/', auth, async (req, res) => {
  const { name, description = '', level = 'beginner', priceCredits = 10 } = req.body;
  const skill = await Skill.create({ userId: req.userId, name, description, level, priceCredits });
  res.json(skill);
});

router.get('/', async (req, res) => {
  const { q } = req.query;
  const filter = q ? { name: { $regex: q, $options: 'i' } } : {};
  const skills = await Skill.find(filter).limit(50).lean();
  res.json(skills);
});

router.delete('/:id', auth, async (req, res) => {
  await Skill.deleteOne({ _id: req.params.id, userId: req.userId });
  res.json({ ok: true });
});

module.exports = router;


