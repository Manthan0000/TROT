const express = require('express');
const jwt = require('jsonwebtoken');
const { appConfig } = require('../config');
const Chat = require('../models/Chat');

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

router.get('/:otherUserId', auth, async (req, res) => {
  const chat = await Chat.findOne({ participants: { $all: [req.userId, req.params.otherUserId] } }).lean();
  res.json(chat || { participants: [req.userId, req.params.otherUserId], messages: [] });
});

router.post('/:otherUserId', auth, async (req, res) => {
  const { text } = req.body;
  const now = new Date();
  const chat = await Chat.findOneAndUpdate(
    { participants: { $all: [req.userId, req.params.otherUserId] } },
    {
      $setOnInsert: { participants: [req.userId, req.params.otherUserId] },
      $push: { messages: { from: req.userId, to: req.params.otherUserId, text, createdAt: now } },
      $set: { updatedAt: now }
    },
    { new: true, upsert: true }
  ).lean();
  res.json(chat);
});

module.exports = router;


