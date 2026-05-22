const express    = require('express');
const http       = require('http');
const { Server } = require('socket.io');
const mongoose   = require('mongoose');
const cors       = require('cors');
require('dotenv').config();

const Stock          = require('./models/Stock');
const PortfolioEntry = require('./models/PortfolioEntry');
const User           = require('./models/User');

const app    = express();
const server = http.createServer(app);

// ── Socket.io ─────────────────────────────────────────────────────────────────
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
});
app.set('io', io);  // accessible in routes via req.app.get('io')

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth',        require('./routes/Auth'));
app.use('/api/stocks',      require('./routes/Stocks'));
app.use('/api/trade',       require('./routes/Trade'));
app.use('/api/portfolio',   require('./routes/Portfolio'));
app.use('/api/leaderboard', require('./routes/Leaderboard'));

app.get('/', (req, res) =>
  res.json({ message: '📈 Stock Simulator API V2' })
);

// ── Socket connection events ──────────────────────────────────────────────────
io.on('connection', (socket) => {
  console.log(`🔌 Connected: ${socket.id}`);

  // User joins their private room (for alerts in V3)
  socket.on('join_room', (userId) => {
    socket.join(userId);
    console.log(`👤 Joined room: ${userId}`);
  });

  socket.on('disconnect', () =>
    console.log(`❌ Disconnected: ${socket.id}`)
  );
});

// ── Leaderboard builder (shared by route + simulator) ────────────────────────
async function buildLeaderboard() {
  const users   = await User.find().select('name virtualBalance');
  const entries = await PortfolioEntry.find().populate('stock', 'currentPrice');

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

  return Object.values(map)
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
}
module.exports.buildLeaderboard = buildLeaderboard;

// ── Price simulator (runs every 3 s after DB connects) ───────────────────────
let tickCount = 0;

function startPriceSimulator() {
  setInterval(async () => {
    try {
      const stocks = await Stock.find();
      if (!stocks.length) return;

      const updates = [];
      for (const s of stocks) {
        const drift = (Math.random() - 0.5) * 0.016; // ±0.8%
        s.currentPrice = Math.max(1, parseFloat((s.currentPrice * (1 + drift)).toFixed(2)));
        await s.save();
        updates.push({
          _id: s._id,
          symbol: s.symbol,
          currentPrice: s.currentPrice,
          changePct: parseFloat((drift * 100).toFixed(3)),
        });
      }

      io.emit('price_update', updates);  // broadcast live prices

      // Refresh leaderboard every ~15 s (every 5th tick)
      tickCount++;
      if (tickCount % 5 === 0) {
        const lb = await buildLeaderboard();
        io.emit('leaderboard_update', lb);
      }
    } catch (err) {
      console.error('Simulator error:', err.message);
    }
  }, 3000);

  console.log(' Price simulator started — ticking every 3s');
}

// ── Start ─────────────────────────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    server.listen(process.env.PORT || 5000, () => {
      console.log(` Server on port ${process.env.PORT || 5000}`);
      startPriceSimulator();
    });
  })
  .catch((err) => {
    console.error('DB failed:', err.message);
    process.exit(1);
  });