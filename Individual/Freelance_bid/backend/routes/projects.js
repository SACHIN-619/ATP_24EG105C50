import express from 'express';
import Project from '../models/Project.js';
import Bid from '../models/Bid.js';
import { protect } from '../middleware/auth.js';
import { roleCheck } from '../middleware/roleCheck.js';
import { createNotification } from '../utils/notify.js';


const router = express.Router();

// GET /api/projects/mine  ← MUST stay above /:id
router.get('/mine', protect, roleCheck('client'), async (req, res) => {
  try {
    const projects = await Project.find({ clientId: req.user._id }).sort('-createdAt');
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/projects
router.get('/', async (req, res) => {
  const { tag, budgetMin, budgetMax, status = 'open' } = req.query;
  const filter = { status };
  if (tag) filter.tags = tag;
  if (budgetMin || budgetMax) {
    filter.budget = {};
    if (budgetMin) filter.budget.$gte = Number(budgetMin);
    if (budgetMax) filter.budget.$lte = Number(budgetMax);
  }
  try {
    const projects = await Project.find(filter)
      .populate('clientId', 'name email rating')
      .sort('-createdAt');
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/projects/:id
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('clientId', 'name email rating');
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const bids = await Bid.find({ projectId: req.params.id })
      .populate('studentId', 'name email rating skills');

    res.json({ project, bids });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/projects
router.post('/', protect, roleCheck('client'), async (req, res) => {
  const { title, description, budget, currency, deadline, tags } = req.body;
  try {
    const project = await Project.create({
      title, description, budget, currency, deadline,
      tags: tags || [],
      clientId: req.user._id
    });
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST /api/projects/:id/bids
router.post('/:id/bids', protect, roleCheck('student'), async (req, res) => {
  const { amount, duration, description } = req.body;
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (project.status !== 'open')
      return res.status(400).json({ message: 'Project is not open for bids' });

    const existing = await Bid.findOne({ studentId: req.user._id, projectId: req.params.id });
    if (existing) return res.status(400).json({ message: 'You already bid on this project' });

    const bid = await Bid.create({
      studentId: req.user._id,
      projectId: req.params.id,
      amount, duration, description
    });
    await createNotification(
      project.clientId,
      'bid_received',
      `📩 New proposal received on "${project.title}"`,
      `/projects/${req.params.id}`
    );
    res.status(201).json(bid);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }

});

// PUT /api/projects/:id/bids/:bidId/accept
router.put('/:id/bids/:bidId/accept', protect, roleCheck('client'), async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (String(project.clientId) !== String(req.user._id))
      return res.status(403).json({ message: 'Not your project' });
// 1. Reject all other bids
    await Bid.updateMany(
      { projectId: req.params.id, _id: { $ne: req.params.bidId } },
      { status: 'rejected' }
    );
    // 2. Accept this specific bid
    const accepted = await Bid.findByIdAndUpdate(
      req.params.bidId, { status: 'accepted' }, { new: true }
    );
    // 3. Update project status
    await Project.findByIdAndUpdate(req.params.id, { status: 'inProgress' });
    // Notify the accepted student
    await createNotification(
      accepted.studentId,
      'bid_accepted',
      `🎉 Your bid on "${project.title}" was accepted!`,
      `/projects/${req.params.id}`
    );

    // Notify rejected students
    const rejectedBids = await Bid.find({
      projectId: req.params.id,
      status: 'rejected',
      _id: { $ne: req.params.bidId }
    });
    for (const b of rejectedBids) {
      await createNotification(
        b.studentId,
        'bid_rejected',
        `Your bid on "${project.title}" was not selected.`,
        `/projects/${req.params.id}`
      );
    }
 // 4. Finally, send the response
    res.json(accepted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }

});

// PUT /api/projects/:id/complete  (client marks project complete)
router.put('/:id/complete', protect, roleCheck('client'), async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (String(project.clientId) !== String(req.user._id))
      return res.status(403).json({ message: 'Not your project' });
    const updated = await Project.findByIdAndUpdate(
      req.params.id, { status: 'completed' }, { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;