const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { appConfig } = require('../config');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) return res.status(400).json({ message: 'Missing fields' });
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already registered' });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, passwordHash, name, credits: appConfig.defaultStartCredits });
    const token = jwt.sign({ id: user._id }, appConfig.jwtSecret, { expiresIn: appConfig.jwtExpiresIn });
    res.json({ token, user: { id: user._id, email: user.email, name: user.name, credits: user.credits } });
  } catch (e) {
    res.status(500).json({ message: 'Register failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id }, appConfig.jwtSecret, { expiresIn: appConfig.jwtExpiresIn });
    res.json({ token, user: { id: user._id, email: user.email, name: user.name, credits: user.credits } });
  } catch (e) {
    res.status(500).json({ message: 'Login failed' });
  }
});

module.exports = router;


