const express = require('express');

const router = express.Router();

router.get('/pricing', (req, res) => {
  res.json({ pricePer100CreditsINR: Number(process.env.PRICE_PER_100_CREDITS_INR || 500) });
});

router.post('/create-checkout-session', (req, res) => {
  res.status(501).json({ message: 'Payments not enabled yet. Provide keys to activate.' });
});

router.post('/webhook', (req, res) => {
  res.status(501).json({ message: 'Payments webhook disabled in MVP.' });
});

module.exports = router;


