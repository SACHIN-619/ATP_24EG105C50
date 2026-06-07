import 'dotenv/config';
import express      from 'express';
import cors         from 'cors';
import connectDB    from './config/db.js';
import authRoutes       from './routes/auth.js';
import projectRoutes    from './routes/projects.js';
import bidRoutes        from './routes/bids.js';
import userRoutes       from './routes/users.js';
import milestoneRoutes  from './routes/milestones.js';   

connectDB();
const app = express();
app.use(cors({ origin: /^http:\/\/localhost:\d+$/, credentials: true }));
app.use(express.json());

app.use('/api/auth',       authRoutes);
app.use('/api/projects',   projectRoutes);
app.use('/api/bids',       bidRoutes);
app.use('/api/users',      userRoutes);
app.use('/api/projects',   milestoneRoutes);   // ← (shares /api/projects/:id/milestones)
app.use('/api/milestones', milestoneRoutes);   // ←  (for /api/milestones/:id/approve etc)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));