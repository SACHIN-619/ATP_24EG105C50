import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Project from '../models/Project.js'; // Ensure this model path matches your project structure

const router = express.Router();

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// GET /api/auth/platform-stats
router.get('/platform-stats', async (req, res) => {
  try {
    // 1. Count ALL students registered on the platform (active + inactive)
    const totalStudents = await User.countDocuments({ role: 'student' });

    // 2. Count ALL projects posted on the platform 
    const totalProjects = await Project.countDocuments();

    // 3. Compute real calculated system satisfaction percentage using active platform scores
    const usersWithRatings = await User.find({ rating: { $gt: 0 } }).select('rating');
    
    let satisfactionPercentage = 98; // Default fallback health target
    if (usersWithRatings.length > 0) {
      const sumRatings = usersWithRatings.reduce((sum, u) => sum + u.rating, 0);
      const averageRating = sumRatings / usersWithRatings.length;
      satisfactionPercentage = Math.round((averageRating / 5) * 100);
    }

    res.json({
      totalStudents,
      totalProjects,
      satisfactionPercentage
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const user = await User.create({ name, email, password, role });

    res.status(201).json({
      _id:   user._id,
      name:  user.name,
      email: user.email,
      role:  user.role,
      token: generateToken(user._id)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id:   user._id,
      name:  user.name,
      email: user.email,
      role:  user.role,
      token: generateToken(user._id)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;