const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/debug", (req, res) => {
  res.json({ ok: true, route: "/api/auth/debug", time: new Date().toISOString() });
});

module.exports = router;


