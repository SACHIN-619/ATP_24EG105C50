const mongoose = require('mongoose');

const StockSchema = new mongoose.Schema(
  {
    symbol: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
    },
    currentPrice: {
      type: Number,
      required: true,
    },
    sector: {
      type: String,
      default: 'General',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Stock', StockSchema);