const express = require('express');
const jwt = require('jsonwebtoken');
const { appConfig } = require('../config');
const User = require('../models/User');
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

// In-memory requests store for MVP
const requests = [];

router.post('/', auth, async (req, res) => {
  const { skillId } = req.body;
  const skill = await Skill.findById(skillId).lean();
  if (!skill) return res.status(404).json({ message: 'Skill not found' });
  if (String(skill.userId) === req.userId) return res.status(400).json({ message: 'Cannot request own skill' });

  const me = await User.findById(req.userId);
  if (me.credits < skill.priceCredits) return res.status(400).json({ message: 'Not enough credits' });

  const reqObj = {
    id: Date.now().toString(),
    from: req.userId,
    to: String(skill.userId),
    skillId: skill._id.toString(),
    priceCredits: skill.priceCredits,
    status: 'pending'
  };
  requests.push(reqObj);
  res.json(reqObj);
});

router.post('/:id/accept', auth, async (req, res) => {
  const r = requests.find((x) => x.id === req.params.id);
  if (!r) return res.status(404).json({ message: 'Request not found' });
  if (r.to !== req.userId) return res.status(403).json({ message: 'Not your request' });
  if (r.status !== 'pending') return res.status(400).json({ message: 'Already handled' });

  const learner = await User.findById(r.from);
  const teacher = await User.findById(r.to);
  if (!learner || !teacher) return res.status(404).json({ message: 'Users not found' });
  if (learner.credits < r.priceCredits) return res.status(400).json({ message: 'Learner lacks credits' });

  learner.credits -= r.priceCredits;
  teacher.credits += r.priceCredits;
  await learner.save();
  await teacher.save();
  r.status = 'accepted';
  res.json(r);
});

router.post('/:id/reject', auth, async (req, res) => {
  const r = requests.find((x) => x.id === req.params.id);
  if (!r) return res.status(404).json({ message: 'Request not found' });
  if (r.to !== req.userId) return res.status(403).json({ message: 'Not your request' });
  if (r.status !== 'pending') return res.status(400).json({ message: 'Already handled' });
  r.status = 'rejected';
  res.json(r);
});

router.get('/', auth, async (req, res) => {
  const mine = requests.filter((r) => r.from === req.userId || r.to === req.userId);
  res.json(mine);
});

module.exports = router;


