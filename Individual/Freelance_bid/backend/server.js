// import 'dotenv/config';
// import express      from 'express';
// import cors         from 'cors';
// import connectDB    from './config/db.js';
// import authRoutes       from './routes/auth.js';
// import projectRoutes    from './routes/projects.js';
// import bidRoutes        from './routes/bids.js';
// import userRoutes       from './routes/users.js';
// import milestoneRoutes  from './routes/milestones.js';   

// connectDB();
// const app = express();
// app.use(cors({ origin: /^http:\/\/localhost:\d+$/, credentials: true }));
// app.use(express.json());

// app.use('/api/auth',       authRoutes);
// app.use('/api/projects',   projectRoutes);
// app.use('/api/bids',       bidRoutes);
// app.use('/api/users',      userRoutes);
// app.use('/api/projects',   milestoneRoutes);   // ← (shares /api/projects/:id/milestones)
// app.use('/api/milestones', milestoneRoutes);   // ←  (for /api/milestones/:id/approve etc)

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

import 'dotenv/config';
import express      from 'express';
import cors         from 'cors';
import connectDB    from './config/db.js';
import authRoutes       from './routes/auth.js';
import projectRoutes    from './routes/projects.js';
import bidRoutes        from './routes/bids.js';
import userRoutes       from './routes/users.js';
import milestoneRoutes  from './routes/milestones.js';   

// Execute connection using configuration file (which references process.env.MONGO_URI)
connectDB();

const app = express();

// Set up robust production-friendly dynamic CORS configurations
const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  process.env.CLIENT_URL, // Deployed frontend URL string 
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow server-to-server requests or applications with no origin header (like Postman/Insomnia)
    if (!origin) return callback(null, true);
    
    // Checks if the request is running locally, matches CLIENT_URL, or is a deployed Vercel instance
    if (ALLOWED_ORIGINS.includes(origin) || /\.vercel\.app$/.test(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS: Request Origin ${origin} blocked by security policy.`));
  },
  credentials: true
}));

app.use(express.json());

// Routes declarations
app.use('/api/auth',       authRoutes);
app.use('/api/projects',   projectRoutes);
app.use('/api/bids',       bidRoutes);
app.use('/api/users',      userRoutes);
app.use('/api/projects',   milestoneRoutes);   // (shares /api/projects/:id/milestones)
app.use('/api/milestones', milestoneRoutes);   // (for /api/milestones/:id/approve etc)

// Global generic health route check to confirm container status upon cloud deployments
app.get("/", (req, res) => {
  res.status(200).json({ status: "online", message: "BidPortal Backend API service is live!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
