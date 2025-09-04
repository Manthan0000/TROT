const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;

dotenv.config();

// Hard defaults from user's provided values, so app runs without .env
const DEFAULTS = {
  MONGODB_URI:
    'mongodb+srv://jasoliya28072006:NifBFlq5KDPlr4Me@cluster0.9cblhdx.mongodb.net/trot?retryWrites=true&w=majority&appName=Cluster0',
  CLOUDINARY_CLOUD_NAME: 'APPLICATION_KEY',
  CLOUDINARY_API_KEY: '774726588211552',
  CLOUDINARY_API_SECRET: 'lqmIW-C4xOMay4JCOlnCqDT9PDw',
  CLOUDINARY_FOLDER: 'trot'
};

const appConfig = {
  port: process.env.PORT || 4000,
  jwtSecret: process.env.JWT_SECRET || 'change_me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  defaultStartCredits: Number(process.env.DEFAULT_START_CREDITS || 100),
  defaultSessionCredit: Number(process.env.DEFAULT_SESSION_CREDIT || 10),
  pricePer100CreditsInINR: Number(process.env.PRICE_PER_100_CREDITS_INR || 500),
  appName: process.env.APP_NAME || 'TROT',
  appSlogan: process.env.APP_SLOGAN || 'Room of talent',
  mongoUri: process.env.MONGODB_URI || DEFAULTS.MONGODB_URI,
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || DEFAULTS.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY || DEFAULTS.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET || DEFAULTS.CLOUDINARY_API_SECRET,
    folder: process.env.CLOUDINARY_FOLDER || DEFAULTS.CLOUDINARY_FOLDER
  }
};

function configureCloudinary() {
  cloudinary.config({
    cloud_name: appConfig.cloudinary.cloudName,
    api_key: appConfig.cloudinary.apiKey,
    api_secret: appConfig.cloudinary.apiSecret
  });
}

async function connectMongo() {
  await mongoose.connect(appConfig.mongoUri, { autoIndex: true });
}

module.exports = { appConfig, connectMongo, configureCloudinary, cloudinary };


