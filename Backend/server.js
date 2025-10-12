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
// Simple request logger to show incoming requests in the server terminal
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ▶ ${req.method} ${req.originalUrl}`);
  next();
});
app.use(cors({ 
  origin: process.env.CLIENT_ORIGIN?.split(",") || true, 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use("/static", express.static(require("path").join(__dirname, "assets")));

// Simple request logger to help debugging incoming API calls from device/emulator
app.use((req, res, next) => {
  try {
    console.log(new Date().toISOString(), req.method, req.originalUrl);
  } catch (e) {}
  next();
});

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/settings", require("./routes/settingsRoutes"));
app.use("/api/avatar", require("./routes/avatarRoutes"));
// Skills routes (handle creating and listing user skills)
const skillsRoutes = require("./routes/skillsRoutes");
app.use("/api/skills", skillsRoutes);
console.log("Mounted /api/skills routes");
console.log("Mounted route: /api/skills -> ./routes/skillsRoutes");

// Simple health check to verify device -> backend connectivity
app.get("/", (req, res) => {
  res.json({ ok: true, service: "backend", time: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0";
app.listen(PORT, HOST, () => console.log(`Server running on http://${HOST}:${PORT}`));
