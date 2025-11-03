const express = require("express");
const router = express.Router();

router.get("/debug", (req, res) => {
  res.json({ ok: true, route: "/api/settings/debug", time: new Date().toISOString() });
});

module.exports = router;


