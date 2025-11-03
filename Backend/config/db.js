const mongoose = require("mongoose");

async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // keep defaults modern; options generally not needed on recent mongoose
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("Mongo connection error:", err?.message || err);
    process.exit(1);
  }
}

module.exports = connectDB;


