import express from 'express';
import Bid from '../models/Bid.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// GET /api/bids/me
router.get('/me', protect, async (req, res) => {
  try {
    const bids = await Bid.find({ studentId: req.user._id })
      .populate('projectId', 'title budget deadline status');
    res.json(bids);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;