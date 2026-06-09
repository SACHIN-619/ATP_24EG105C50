# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.




Frontend
npm create vite@latest frontend -- --template react
cd frontend
npm install react-router-dom axios
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p




# Tasks  ( V3 )
 
 # Task 2 — Frontend (1 hr): Create MilestoneTracker.jsx, add route to App.jsx, add the Milestones button to ProjectDetails sidebar, add quick-link chips to both dashboards

     MilestoneTracker.jsx — vertical timeline, segmented progress bar, payment stats, add form, inline approve/reject with notes


# frontend/ — The Client

# main.jsx
The entry point. Renders <App /> into the #root div in index.html. Just three lines.

# index.css + tailwind.config.js
index.css defines CSS custom properties (--accent, --border, etc.) used everywhere. This is your design system — changing --accent from #4F46E5 to any color would update every button, link, and badge in the entire app instantly.
The fade-up animation class creates the staggered load-in effect on every page. fade-up-1 through fade-up-4 have increasing animation-delay values, making elements appear one after another.

# context/AuthContext.jsx
React Context solves a specific problem: passing data to deeply nested components without threading props through every level. Without it, you'd need to pass user as a prop from App → Navbar → every page → every component.
jsconst { user, login, logout } = useAuth();
login() saves the user object and token to both React state and localStorage. localStorage persists across page refreshes — that's why you don't get logged out when you reload the page.

# api/axios.js
An Axios instance with two configurations:

baseURL — so every call uses api.get('/projects') instead of repeating the full URL.
Request interceptor — runs before every request. Reads the token from localStorage and adds the Authorization header automatically. Without this, you'd manually add the header to every single API call.


# App.jsx
Defines all routes using React Router. <Route path="/projects/:id" element={<ProjectDetails />} /> means the :id part is dynamic — navigating to /projects/abc123 makes abc123 available inside the component via useParams().

# pages/Home.jsx
Pure presentational page. No API calls. The hero section, feature cards, and CTA section are static. The only logic is checking if a user is already logged in and showing "Go to Dashboard" instead of the signup buttons.

pages/Login.jsx + pages/Signup.jsx
Both follow the same pattern:

Local useState for form fields
handleSubmit calls the API
On success, calls login(data) from AuthContext which stores the token
navigate() redirects to the correct dashboard based on data.role

The role toggle in Signup uses a styled segmented control (two buttons that look like a single pill) — purely CSS, no library.

# pages/ClientDashboard.jsx + pages/StudentDashboard.jsx
Both check role on mount and redirect to /login if wrong role or not logged in. This is client-side route protection — the server still independently enforces roles, but this prevents wrong-role users from even seeing the UI.
Stats cards compute live from the fetched data using .filter().length — no extra API call needed.

# pages/ProjectsList.jsx
Demonstrates two kinds of filtering:

Server-side: tag filter calls the API with ?tag=react — the backend filters in MongoDB.
Client-side: search filter runs .filter() on already-fetched data — no new API call.

Server-side is better for large datasets. Client-side is instant for small ones.

# pages/ProjectDetails.jsx
The most complex page. Handles three different user states simultaneously:

Visitor (not logged in): read-only view
Client (project owner): can accept bids, mark complete, leave review
Student: can submit bid if haven't already, see own bid status

isOwner checks String(project.clientId._id) === user._id. The String() conversion is necessary because MongoDB ObjectIds are objects, not strings — direct === comparison would always be false.

# pages/Profile.jsx
Tab-based layout using a single tab state string. Rather than three separate components conditionally rendered with {tab === 'X' && <Component />}, each tab component is always defined but only rendered when active. This is the simplest tab pattern in React.

# pages/EditProfile.jsx
    Portfolio items are managed entirely in local React state before saving. You can add and remove items without touching the API. Only when you click "Save Changes" does it send the entire portfolio array in one PUT request — this is more efficient than an API call per item.

# pages/MilestoneTracker.jsx
The segmented progress bar maps each milestone to a proportional width slice:
jswidth: `${(m.amount / totalBudget) * 100}%`
Color changes based on status. This gives an instant visual sense of payment progress without any charting library.
actionNote state uses { id, value } — the id identifies which card has the note input open, and value is the text. This lets only one note input be open at a time across all milestone cards.

# components/Navbar.jsx
    Sticky positioned with backdrop-filter: blur(12px) — this creates the frosted glass effect when content scrolls behind it. The isActive() helper compares the current URL path and highlights the matching nav link.

# components/ReviewModal.jsx
    Rendered at the root level of ProjectDetails (not inside the bids loop) so it overlays the entire page. The overlay div's onClick closes the modal when you click outside — e.target === e.currentTarget ensures it only fires on the backdrop, not when clicking inside the modal content.
# Tasks  (V4 )
   1. Create ThemeContext.jsx, update main.jsx
2. Add dark mode CSS tokens to index.css
3. Create NotificationBell.jsx, FilterBar.jsx, NotificationsPage.jsx
4. Update Navbar.jsx with bell + theme toggle
5. Update ProjectsList.jsx with FilterBar
6. Add /notifications route to App.jsx


-  ThemeContext (dark mode, persists in localStorage), NotificationBell (dropdown with live polling every 30s, unread badge), FilterBar (search + tag + budget range + status, quick chip shortcuts), NotificationsPage (full inbox view), updated ProjectsList with full filter support, updated Navbar with bell + dark mode toggle
