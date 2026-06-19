import express from 'express';
import User from '../models/User.js';
import Milestone from '../models/Milestone.js'; // Moved clean to the top
import Review from '../models/Review.js';
import Bid from '../models/Bid.js'; // Moved clean to the top
import Project from '../models/Project.js';
import { protect } from '../middleware/auth.js';
import { roleCheck } from '../middleware/roleCheck.js';
import { createNotification } from '../utils/notify.js';

const router = express.Router();

// GET /api/users/leaderboard — Fair, Multi-Tier Balanced Campus Ranking
router.get('/leaderboard', async (req, res) => {
  try {
    // 1. Fetch ALL registered platform students automatically (active + inactive)
    const students = await User.find({ role: 'student' })
      .select('name skills rating verifiedSkills portfolio createdAt')
      .lean();

    const enriched = await Promise.all(students.map(async (s) => {
      // Find all project contracts accepted by this student
      const acceptedBids = await Bid.find({ studentId: s._id, status: 'accepted' }).select('projectId');
      const projectIds = acceptedBids.map(b => b.projectId);

      // Aggregate live virtual earnings from completed and approved milestones
      const earned = await Milestone.aggregate([
        { $match: { projectId: { $in: projectIds }, status: 'approved' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);

      return {
        _id:            s._id,
        name:           s.name,
        rating:         s.rating || 0,
        skills:         s.skills || [],
        verifiedSkills: s.verifiedSkills || [],
        projectsDone:   acceptedBids.length || 0,
        earned:         earned[0]?.total || 0,
        portfolioCount: s.portfolio?.length || 0,
        createdAt:      s.createdAt
      };
    }));

    // 🏆 Balanced 6-tier fallback sorting algorithm
    enriched.sort((a, b) => {
      // Tier 1: Core Virtual Earnings
      if (b.earned !== a.earned) return b.earned - a.earned;
      
      // Tier 2: Star Execution Rating Quality
      if (b.rating !== a.rating) return b.rating - a.rating;
      
      // Tier 3: Technical Quiz Badge counts
      if (b.verifiedSkills.length !== a.verifiedSkills.length) {
        return b.verifiedSkills.length - a.verifiedSkills.length;
      }
      
      // Tier 4: Profile Preparation (Portfolio item size completeness)
      if (b.portfolioCount !== a.portfolioCount) return b.portfolioCount - a.portfolioCount;
      
      // Tier 5: Variety of claimed general skills
      if (b.skills.length !== a.skills.length) return b.skills.length - a.skills.length;
      
      // Tier 6: First-come baseline seniority fallback (Oldest accounts rank higher)
      return new Date(a.createdAt) - new Date(b.createdAt);
    });

    // Safely return top 20 campus entries
    res.json(enriched.slice(0, 20));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

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
      .populate('clientId', 'name')
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
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (String(project.clientId) !== String(req.user._id))
      return res.status(403).json({ message: 'Not your project' });
    if (project.status !== 'completed')
      return res.status(400).json({ message: 'Project must be completed before reviewing' });

    const bid = await Bid.findOne({ projectId, studentId, status: 'accepted' });
    if (!bid) return res.status(400).json({ message: 'This student did not work on your project' });

    const review = await Review.create({
      projectId, studentId, rating, comment,
      clientId: req.user._id
    });

    await createNotification(
      studentId,
      'review_received',
      `⭐ You received a ${rating}-star review!`,
      `/profile/${studentId}`
    );

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

// Quiz questions store
const QUIZZES = {
  React: [
    { q: 'What hook manages local state in React?', options: ['useEffect', 'useState', 'useContext', 'useRef'], answer: 1 },
    { q: 'What does JSX stand for?', options: ['JavaScript XML', 'Java Syntax Extension', 'JS Execute', 'None'], answer: 0 },
    { q: 'Which method renders a React component to the DOM?', options: ['React.render()', 'ReactDOM.createRoot().render()', 'React.mount()', 'DOM.render()'], answer: 1 },
    { q: 'What is the virtual DOM?', options: ['A browser API', 'A lightweight copy of the real DOM', 'A CSS framework', 'A database'], answer: 1 },
    { q: 'useEffect with [] runs...?', options: ['On every render', 'Never', 'Once after mount', 'Before render'], answer: 2 },
  ],
  'Node.js': [
    { q: 'What does require() do in Node.js?', options: ['Imports a module', 'Exports a module', 'Creates a server', 'None'], answer: 0 },
    { q: 'Which object handles HTTP requests in Express?', options: ['req', 'res', 'app', 'router'], answer: 0 },
    { q: 'npm stands for?', options: ['Node Package Manager', 'New Project Module', 'Node Program Manager', 'None'], answer: 0 },
    { q: 'What is middleware in Express?', options: ['A database', 'A function that runs between request and response', 'A React hook', 'A CSS library'], answer: 1 },
    { q: 'process.env is used for?', options: ['Environment variables', 'Process ID', 'CPU usage', 'Logging'], answer: 0 },
  ],
  Python: [
    { q: 'Which keyword defines a function in Python?', options: ['func', 'def', 'function', 'lambda'], answer: 1 },
    { q: 'What does len() return?', options: ['Last element', 'Length of object', 'Sum', 'Index'], answer: 1 },
    { q: 'How do you create a list in Python?', options: ['{}', '()', '[]', '<>'], answer: 2 },
    { q: 'What is a decorator in Python?', options: ['A CSS tool', 'A function that wraps another function', 'A class method', 'A variable type'], answer: 1 },
    { q: 'Which library is used for data analysis?', options: ['NumPy', 'React', 'Express', 'Django'], answer: 0 },
  ],
  Figma: [
    { q: 'Figma is primarily used for?', options: ['Backend development', 'UI/UX design', 'Database management', 'SEO'], answer: 1 },
    { q: 'What are Figma components?', options: ['Reusable design elements', 'Code snippets', 'Database tables', 'API endpoints'], answer: 0 },
    { q: 'Auto Layout in Figma is used for?', options: ['Animation', 'Responsive designs', 'Color themes', 'Exporting'], answer: 1 },
    { q: 'Figma frames are similar to?', options: ['Functions', 'HTML divs / artboards', 'Variables', 'APIs'], answer: 1 },
    { q: 'What format does Figma export for developers?', options: ['PDF only', 'CSS, SVG, PNG and more', 'Word docs', 'Excel'], answer: 1 },
  ],
};

// POST /api/users/verify-skill
router.post('/verify-skill', protect, roleCheck('student'), async (req, res) => {
  const { skill, answers } = req.body;
  try {
    const quiz = QUIZZES[skill];
    if (!quiz) return res.status(400).json({ message: 'No quiz available for this skill' });

    const correct = answers.filter((a, i) => a === quiz[i].answer).length;
    const passed = correct >= 4;

    if (passed) {
      await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { verifiedSkills: skill }
      });
    }
    res.json({ passed, correct, total: quiz.length, skill });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/users/quiz/:skill
router.get('/quiz/:skill', protect, (req, res) => {
  const quiz = QUIZZES[req.params.skill];
  if (!quiz) return res.status(404).json({ message: 'No quiz for this skill' });
  res.json(quiz.map(({ q, options }) => ({ q, options })));
});

export default router;