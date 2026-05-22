const mongoose = require('mongoose');

const PortfolioEntrySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    stock: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Stock',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    avgBuyPrice: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PortfolioEntry', PortfolioEntrySchema);