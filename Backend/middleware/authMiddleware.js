const jwt = require("jsonwebtoken");

module.exports = function authMiddleware(req, res, next) {
  try {
    const header = req.headers["authorization"] || req.headers["Authorization"]; 
    const token = (header || "").startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: "No token provided" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
    req.user = decoded.id || decoded._id || decoded.userId || decoded.sub;
    if (!req.user) return res.status(401).json({ error: "Invalid token" });
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};


