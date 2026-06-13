 Frontend Client App (Vite + React)

This directory houses the client application for the Freelancer Bid Portal. Built with **React 19**, **Vite**, and **Tailwind CSS v4**, it includes client-side route protection, global authentication handling, a robust theme controller, and contextual polling updates.

## ⚙️ Environment Configuration

Create a `.env` file within the `frontend/` directory to manage local development targets:

```env
VITE_API_URL=http://localhost:5000
Note: In production, this variable is mapped to your live Render server within the Vercel variables dashboard across all deployment environments (Production, Preview, and Development).🎨 Design Tokens & Theming ConfigurationStyling is driven by Tailwind CSS v4 utilizing an atomic design system injected straight into src/index.css.Custom Typography & Variable OverridesCSS@theme {
  --font-display: "Playfair Display", serif;
  --font-sans: "DM Sans", sans-serif;
}
The application leverages dynamic CSS variable switches (:root vs [data-theme="dark"]) to instantly flip layouts, navigation paths, canvas backdrops, and text colors globally. This avoids running complex, slow JS calculations for theme updates.🧠 Application Files Explainedsrc/context/AuthContext.jsx: Preserves persistent session token strings inside browser localStorage, ensuring user data remains intact when refreshing pages.src/context/ThemeContext.jsx (V4 Update): Manages dark/light mode states, persisting the user's preference in localStorage.src/api/axios.js: Centralizes API communication. An automated request interceptor injects standard authorization headers into every outbound network call.src/pages/MilestoneTracker.jsx: Computes proportional layouts dynamically based on milestones relative to the total project budget:$$\text{Slice Width} = \left( \frac{\text{Milestone Amount}}{\text{Total Budget}} \right) \times 100\%$$src/components/NotificationBell.jsx (V4 Update): A persistent navbar component configured with a 30-second automated interval loop to poll for inbox status updates.📜 Available Command ScriptsRun these commands inside the frontend/ subdirectory:CommandActionnpm installRestores client-side dependencies.npm run devLaunches local development compiler on port 5173.npm run buildCompiles an optimized distribution bundle into /dist.
