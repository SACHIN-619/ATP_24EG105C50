const express = require('express');
const router  = express.Router();
const auth    = require('../middleware/Auth');
const User    = require('../models/User');
const PortfolioEntry = require('../models/PortfolioEntry');

// GET /api/leaderboard
// Returns top-10 users ranked by total wealth (cash + portfolio value)
router.get('/', auth, async (req, res) => {
  try {
    const users   = await User.find().select('name virtualBalance');
    const entries = await PortfolioEntry.find().populate('stock', 'currentPrice');

    // Build a wealth map: userId → { name, cash, portfolioValue }
    const map = {};
    for (const u of users) {
      map[u._id.toString()] = {
        userId: u._id,
        name: u.name,
        cash: u.virtualBalance,
        portfolioValue: 0,
      };
    }

    for (const e of entries) {
      const uid = e.user.toString();
      if (map[uid] && e.stock) {
        map[uid].portfolioValue += e.stock.currentPrice * e.quantity;
      }
    }

    const ranked = Object.values(map)
      .map((u) => ({ ...u, totalWealth: u.cash + u.portfolioValue }))
      .sort((a, b) => b.totalWealth - a.totalWealth)
      .slice(0, 10)
      .map((u, i) => ({
        rank:           i + 1,
        name:           u.name,
        userId:         u.userId,
        portfolioValue: parseFloat(u.portfolioValue.toFixed(2)),
        cashBalance:    parseFloat(u.cash.toFixed(2)),
        totalWealth:    parseFloat(u.totalWealth.toFixed(2)),
      }));

    // Also send current user's rank even if not top-10
    const currentUserId = req.user.id;
    const allRanked = Object.values(map)
      .map((u) => ({ ...u, totalWealth: u.cash + u.portfolioValue }))
      .sort((a, b) => b.totalWealth - a.totalWealth);

    const myRank = allRanked.findIndex(
      (u) => u.userId.toString() === currentUserId
    ) + 1;

    res.json({ leaderboard: ranked, myRank, totalUsers: allRanked.length });
  } catch (err) {
    console.error('Leaderboard error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;