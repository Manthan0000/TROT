const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Connect MongoDB
connectDB();

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN?.split(",") || true, credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use("/static", express.static(require("path").join(__dirname, "assets")));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/settings", require("./routes/settingsRoutes"));
app.use("/api/avatar", require("./routes/avatarRoutes"));

// Simple health check to verify device -> backend connectivity
app.get("/", (req, res) => {
  res.json({ ok: true, service: "backend", time: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
