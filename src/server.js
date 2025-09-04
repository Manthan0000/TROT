const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const { connectMongo, configureCloudinary, appConfig } = require('./config');

const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const skillsRoutes = require('./routes/skills');
const matchRoutes = require('./routes/match');
const requestsRoutes = require('./routes/requests');
const chatRoutes = require('./routes/chat');
const paymentsRoutes = require('./routes/payments');

async function start() {
  await connectMongo();
  configureCloudinary();

  const app = express();
  app.use(cors());
  app.use(helmet());
  app.use(morgan('dev'));
  app.use(express.json({ limit: '2mb' }));
  app.use(cookieParser());
  app.use(rateLimit({ windowMs: 60 * 1000, max: 120 }));

  app.get('/', (req, res) => {
    res.json({ name: appConfig.appName, slogan: appConfig.appSlogan, ok: true });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/profile', profileRoutes);
  app.use('/api/skills', skillsRoutes);
  app.use('/api/match', matchRoutes);
  app.use('/api/requests', requestsRoutes);
  app.use('/api/chat', chatRoutes);
  app.use('/api/payments', paymentsRoutes);

  const port = appConfig.port;
  app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
}

start().catch((err) => {
  console.error('Failed to start server', err);
  process.exit(1);
});


