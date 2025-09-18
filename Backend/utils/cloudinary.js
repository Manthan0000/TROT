const cloudinary = require("cloudinary").v2;

// Support both correct and misspelled env names
const cloudName = process.env.CLOUD_NAME || process.env.CLOUDE_NAME;
const apiKey = process.env.CLOUD_API_KEY || process.env.CLOUDE_API_KEY;
const apiSecret = process.env.CLOUD_API_SECRET || process.env.CLOUDE_API_SECRET;

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

module.exports = cloudinary;


