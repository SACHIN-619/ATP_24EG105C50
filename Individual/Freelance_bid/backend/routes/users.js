import express from 'express';
import User    from '../models/User.js';
import Review  from '../models/Review.js';
import Bid     from '../models/Bid.js';
import Project from '../models/Project.js';
import { protect }   from '../middleware/auth.js';
import { roleCheck } from '../middleware/roleCheck.js';

const router = express.Router();

// GET /api/users/:id  — public profile
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/users/:id/reviews  — all reviews for a student
router.get('/:id/reviews', async (req, res) => {
  try {
    const reviews = await Review.find({ studentId: req.params.id })
      .populate('clientId',  'name')
      .populate('projectId', 'title')
      .sort('-createdAt');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/users/me  — update own profile (bio, skills, portfolio)
router.put('/me', protect, async (req, res) => {
  const { bio, skills, portfolio, name } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { bio, skills, portfolio, name },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST /api/reviews  — client posts a review for a student
router.post('/reviews', protect, roleCheck('client'), async (req, res) => {
  const { projectId, studentId, rating, comment } = req.body;
  try {
    // Validate: project must be completed and belong to this client
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (String(project.clientId) !== String(req.user._id))
      return res.status(403).json({ message: 'Not your project' });
    if (project.status !== 'completed')
      return res.status(400).json({ message: 'Project must be completed before reviewing' });

    // Validate: student actually worked on this project (accepted bid)
    const bid = await Bid.findOne({ projectId, studentId, status: 'accepted' });
    if (!bid) return res.status(400).json({ message: 'This student did not work on your project' });

    const review = await Review.create({
      projectId, studentId, rating, comment,
      clientId: req.user._id
    });

    // Recompute average rating for student
    const allReviews = await Review.find({ studentId });
    const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await User.findByIdAndUpdate(studentId, { rating: Math.round(avg * 10) / 10 });

    res.status(201).json(review);
  } catch (err) {
    if (err.code === 11000)
      return res.status(400).json({ message: 'You already reviewed this student for this project' });
    res.status(500).json({ message: err.message });
  }
});

export default router;