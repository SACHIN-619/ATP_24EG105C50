import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider }     from './context/AuthContext';
import Navbar               from './components/Navbar';
import Home                 from './pages/Home';
import Login                from './pages/Login';
import Signup               from './pages/Signup';
import ClientDashboard      from './pages/ClientDashboard';
import StudentDashboard     from './pages/StudentDashboard';
import ProjectsList         from './pages/ProjectsList';
import ProjectDetails       from './pages/ProjectDetails';
import ProjectForm          from './pages/ProjectForm';
import BidForm              from './pages/BidForm';
import Profile              from './pages/Profile';
import EditProfile          from './pages/EditProfile';
import MilestoneTracker     from './pages/MilestoneTracker';
import NotificationsPage    from './pages/NotificationsPage';
import SkillQuiz from './pages/SkillQuiz';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/"                        element={<Home />} />
          <Route path="/login"                   element={<Login />} />
          <Route path="/signup"                  element={<Signup />} />
          <Route path="/client/dashboard"        element={<ClientDashboard />} />
          <Route path="/student/dashboard"       element={<StudentDashboard />} />
          <Route path="/projects"                element={<ProjectsList />} />
          <Route path="/projects/:id"            element={<ProjectDetails />} />
          <Route path="/client/projects/new"     element={<ProjectForm />} />
          <Route path="/projects/:id/bid"        element={<BidForm />} />
          <Route path="/profile/:id"             element={<Profile />} />
          <Route path="/profile/edit"            element={<EditProfile />} />
          <Route path="/projects/:id/milestones" element={<MilestoneTracker />} />
          <Route path="/notifications"           element={<NotificationsPage />} />
          <Route path="/quiz/:skill"             element={<SkillQuiz />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}