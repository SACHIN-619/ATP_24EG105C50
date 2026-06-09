import express from 'express';
import User from '../models/User.js';
import Review from '../models/Review.js';
import Bid from '../models/Bid.js';
import Project from '../models/Project.js';
import { protect } from '../middleware/auth.js';
import { roleCheck } from '../middleware/roleCheck.js';
import { createNotification } from '../utils/notify.js';


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
    //v4
    await createNotification(
      studentId,
      'review_received',
      `⭐ You received a ${rating}-star review!`,
      `/profile/${studentId}`
    );
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


// Quiz questions store (expandable)
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
  const { skill, answers } = req.body;  // answers: [0,1,2,1,0]

  try {
    const quiz = QUIZZES[skill];
    if (!quiz) return res.status(400).json({ message: 'No quiz available for this skill' });

    const correct = answers.filter((a, i) => a === quiz[i].answer).length;
    const passed = correct >= 4;  // 4/5 to pass

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
// GET /api/users/quiz/:skill  — get questions (no answers sent to client)
router.get('/quiz/:skill', protect, (req, res) => {
  const quiz = QUIZZES[req.params.skill];
  if (!quiz) return res.status(404).json({ message: 'No quiz for this skill' });
  res.json(quiz.map(({ q, options }) => ({ q, options })));  // strip answers
});
export default router;