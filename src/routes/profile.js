const express = require('express');
const multer = require('multer');
const { cloudinary } = require('../config');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { appConfig } = require('../config');

const upload = multer({ storage: multer.memoryStorage() });
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

router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.userId).lean();
  res.json(user);
});

router.put('/me', auth, async (req, res) => {
  const { name, bio, skillsTeach = [], skillsLearn = [] } = req.body;
  const updated = await User.findByIdAndUpdate(
    req.userId,
    { name, bio, skillsTeach, skillsLearn },
    { new: true }
  ).lean();
  res.json(updated);
});

router.post('/me/avatar', auth, upload.single('avatar'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file' });
  const result = await cloudinary.uploader.upload_stream(
    { folder: process.env.CLOUDINARY_FOLDER || 'trot', resource_type: 'image' },
    async (err, uploadResult) => {
      if (err) return res.status(500).json({ message: 'Upload failed' });
      const updated = await User.findByIdAndUpdate(
        req.userId,
        { avatarUrl: uploadResult.secure_url },
        { new: true }
      ).lean();
      res.json(updated);
    }
  );
  require('stream').Readable.from(req.file.buffer).pipe(result);
});

module.exports = router;


