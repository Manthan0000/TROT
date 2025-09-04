const express = require('express');
const jwt = require('jsonwebtoken');
const { appConfig } = require('../config');
const User = require('../models/User');

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

router.get('/suggestions', auth, async (req, res) => {
  const me = await User.findById(req.userId).lean();
  if (!me) return res.status(404).json({ message: 'User not found' });
  const matches = await User.find({
    _id: { $ne: me._id },
    skillsTeach: { $in: me.skillsLearn || [] },
    skillsLearn: { $in: me.skillsTeach || [] }
  })
    .select('name avatarUrl skillsTeach skillsLearn credits')
    .limit(50)
    .lean();
  res.json(matches);
});

module.exports = router;


