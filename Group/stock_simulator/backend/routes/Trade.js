const express = require('express');
const router = express.Router();
const auth = require('../middleware/Auth');
const User = require('../models/User');
const Stock = require('../models/Stock');
const PortfolioEntry = require('../models/PortfolioEntry');
const Transaction = require('../models/Transaction');

// POST /api/trade/buy
router.post('/buy', auth, async (req, res) => {
  try {
    const { stockId, quantity } = req.body;

    if (!stockId || !quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Stock and valid quantity required' });
    }

    const qty = parseInt(quantity);

    // Get stock and user
    const stock = await Stock.findById(stockId);
    if (!stock) return res.status(404).json({ message: 'Stock not found' });

    const user = await User.findById(req.user.id);
    const totalCost = stock.currentPrice * qty;

    // Check balance
    if (user.virtualBalance < totalCost) {
      return res.status(400).json({
        message: `Insufficient balance. Need ₹${totalCost.toFixed(2)}, have ₹${user.virtualBalance.toFixed(2)}`,
        code: 'INSUFFICIENT_BALANCE',
      });
    }

    // Deduct balance
    user.virtualBalance -= totalCost;
    await user.save();

    // Upsert portfolio entry (weighted average price)
    const existing = await PortfolioEntry.findOne({
      user: user._id,
      stock: stock._id,
    });

    if (existing) {
      const totalQty = existing.quantity + qty;
      const newAvg =
        (existing.avgBuyPrice * existing.quantity + stock.currentPrice * qty) / totalQty;
      existing.quantity = totalQty;
      existing.avgBuyPrice = newAvg;
      await existing.save();
    } else {
      await PortfolioEntry.create({
        user: user._id,
        stock: stock._id,
        quantity: qty,
        avgBuyPrice: stock.currentPrice,
      });
    }

    // Record transaction
    await Transaction.create({
      user: user._id,
      stock: stock._id,
      type: 'buy',
      quantity: qty,
      price: stock.currentPrice,
      totalCost,
    });

    res.json({
      message: `✅ Bought ${qty} shares of ${stock.symbol} at ₹${stock.currentPrice}`,
      newBalance: user.virtualBalance,
    });
  } catch (err) {
    console.error('Buy error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/trade/sell
router.post('/sell', auth, async (req, res) => {
  try {
    const { stockId, quantity } = req.body;

    if (!stockId || !quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Stock and valid quantity required' });
    }

    const qty = parseInt(quantity);

    const stock = await Stock.findById(stockId);
    if (!stock) return res.status(404).json({ message: 'Stock not found' });

    const user = await User.findById(req.user.id);

    // Check ownership
    const entry = await PortfolioEntry.findOne({
      user: user._id,
      stock: stock._id,
    });

    if (!entry || entry.quantity < qty) {
      return res.status(400).json({
        message: `You only own ${entry ? entry.quantity : 0} shares of ${stock.symbol}`,
        code: 'NOT_ENOUGH_SHARES',
      });
    }

    const totalEarned = stock.currentPrice * qty;

    // Credit balance
    user.virtualBalance += totalEarned;
    await user.save();

    // Update portfolio
    entry.quantity -= qty;
    if (entry.quantity === 0) {
      await entry.deleteOne();
    } else {
      await entry.save();
    }

    // Record transaction
    await Transaction.create({
      user: user._id,
      stock: stock._id,
      type: 'sell',
      quantity: qty,
      price: stock.currentPrice,
      totalCost: totalEarned,
    });

    res.json({
      message: `✅ Sold ${qty} shares of ${stock.symbol} at ₹${stock.currentPrice}`,
      newBalance: user.virtualBalance,
    });
  } catch (err) {
    console.error('Sell error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/trade/history — transaction history
router.get('/history', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id })
      .populate('stock', 'symbol name')
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;