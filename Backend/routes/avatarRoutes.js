const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const { uploadAvatarFile } = require("../controllers/avatarController");

router.post("/upload", protect, upload.single("avatar"), uploadAvatarFile);

module.exports = router;


