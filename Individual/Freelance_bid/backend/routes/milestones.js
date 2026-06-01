import express from 'express';
import Milestone from '../models/Milestone.js';
import Project   from '../models/Project.js';
import Bid       from '../models/Bid.js';
import { protect }   from '../middleware/auth.js';
import { roleCheck } from '../middleware/roleCheck.js';

const router = express.Router();

// GET /api/projects/:id/milestones
router.get('/:id/milestones', protect, async (req, res) => {
  try {
    const milestones = await Milestone.find({ projectId: req.params.id }).sort('dueDate');
    res.json(milestones);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/projects/:id/milestones  (client only)
router.post('/:id/milestones', protect, roleCheck('client'), async (req, res) => {
  const { title, amount, dueDate, note } = req.body;
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (String(project.clientId) !== String(req.user._id))
      return res.status(403).json({ message: 'Not your project' });

    // Guard: total milestones amount must not exceed project budget
    const existing = await Milestone.find({ projectId: req.params.id });
    const totalSoFar = existing.reduce((sum, m) => sum + m.amount, 0);
    if (totalSoFar + Number(amount) > project.budget)
      return res.status(400).json({
        message: `Milestone total would exceed project budget of ₹${project.budget}`
      });

    const milestone = await Milestone.create({
      projectId: req.params.id, title, amount, dueDate, note
    });
    res.status(201).json(milestone);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/milestones/:milestoneId/complete  (student marks done)
router.put('/:milestoneId/complete', protect, roleCheck('student'), async (req, res) => {
  try {
    const milestone = await Milestone.findById(req.params.milestoneId);
    if (!milestone) return res.status(404).json({ message: 'Milestone not found' });

    // Verify student has accepted bid on this project
    const bid = await Bid.findOne({
      projectId: milestone.projectId,
      studentId: req.user._id,
      status: 'accepted'
    });
    if (!bid) return res.status(403).json({ message: 'You are not the assigned student' });

    if (milestone.status !== 'pending')
      return res.status(400).json({ message: 'Only pending milestones can be marked complete' });

    milestone.status = 'completed';
    milestone.note   = req.body.note || milestone.note;
    await milestone.save();
    res.json(milestone);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/milestones/:milestoneId/approve  (client approves → virtual payment)
router.put('/:milestoneId/approve', protect, roleCheck('client'), async (req, res) => {
  try {
    const milestone = await Milestone.findById(req.params.milestoneId)
      .populate('projectId');
    if (!milestone) return res.status(404).json({ message: 'Milestone not found' });
    if (String(milestone.projectId.clientId) !== String(req.user._id))
      return res.status(403).json({ message: 'Not your project' });
    if (milestone.status !== 'completed')
      return res.status(400).json({ message: 'Milestone must be completed first' });

    milestone.status = 'approved';
    await milestone.save();
    res.json(milestone);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/milestones/:milestoneId/reject  (client rejects → back to pending)
router.put('/:milestoneId/reject', protect, roleCheck('client'), async (req, res) => {
  try {
    const milestone = await Milestone.findById(req.params.milestoneId)
      .populate('projectId');
    if (!milestone) return res.status(404).json({ message: 'Milestone not found' });
    if (String(milestone.projectId.clientId) !== String(req.user._id))
      return res.status(403).json({ message: 'Not your project' });
    if (milestone.status !== 'completed')
      return res.status(400).json({ message: 'Can only reject a completed milestone' });

    milestone.status = 'pending';  // sent back for rework
    milestone.note   = req.body.note || '';
    await milestone.save();
    res.json(milestone);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/milestones/:milestoneId  (client deletes pending milestone)
router.delete('/:milestoneId', protect, roleCheck('client'), async (req, res) => {
  try {
    const milestone = await Milestone.findById(req.params.milestoneId)
      .populate('projectId');
    if (!milestone) return res.status(404).json({ message: 'Milestone not found' });
    if (String(milestone.projectId.clientId) !== String(req.user._id))
      return res.status(403).json({ message: 'Not your project' });
    if (milestone.status !== 'pending')
      return res.status(400).json({ message: 'Can only delete pending milestones' });

    await milestone.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;