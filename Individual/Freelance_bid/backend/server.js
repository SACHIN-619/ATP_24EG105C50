import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import projectRoutes from './routes/projects.js';
import bidRoutes from './routes/bids.js';
import userRoutes    from './routes/users.js'; 

connectDB();

const app = express();

app.use(cors({
  origin: /^http:\/\/localhost:\d+$/,
  credentials: true
}));
app.use(express.json());

app.use('/api/auth',     authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/bids',     bidRoutes);
app.use('/api/users',    userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));