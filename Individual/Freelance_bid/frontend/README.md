
## Frontend Client App (Vite and React)
This directory houses the client application for the Freelancer Bid Portal. Built with React 19, Vite, and Tailwind CSS v4, it includes client-side route protection, global authentication handling, a robust theme controller, and contextual polling updates. [1, 2, 3] 
## Environment Configuration
Create a .env file within the frontend/ directory to manage local development targets:

VITE_API_URL=http://localhost:5000

Note: In production, this variable is mapped to your live Render server within the Vercel variables dashboard across all deployment environments (Production, Preview, and Development). [4, 5, 6] 
------------------------------
## Design Tokens and Theming Configuration
Styling is driven by [Tailwind CSS v4](https://tailwindcss.com/blog/tailwindcss-v4) utilizing an atomic design system injected straight into src/index.css. [7] 
## Custom Typography and Variable Overrides

@theme {
  --font-display: "Playfair Display", serif;
  --font-sans: "DM Sans", sans-serif;
}

The application leverages dynamic CSS variable switches (:root vs [data-theme="dark"]) to instantly flip layouts, navigation paths, canvas backdrops, and text colors globally. This avoids running complex, slow JS calculations for theme updates.
------------------------------
## Application Files Explained

* src/context/AuthContext.jsx: Preserves persistent session token strings inside browser localStorage, ensuring user data remains intact when refreshing pages.
* src/context/ThemeContext.jsx (V4 Update): Manages dark/light mode states, persisting the user's preference in localStorage.
* src/api/axios.js: Centralizes API communication. An automated request interceptor injects standard authorization headers into every outbound network call.
* src/pages/MilestoneTracker.jsx: Computes proportional layouts dynamically based on milestones relative to the total project budget using the following calculation: Slice Width = (Milestone Amount / Total Budget) * 100%.
* src/components/NotificationBell.jsx (V4 Update): A persistent navbar component configured with a 30-second automated interval loop to poll for inbox status updates.

------------------------------
## Available Command Scripts
Run these commands inside the frontend/ subdirectory:

| Command [8, 9] | Action |
|---|---|
| npm install | Restores client-side dependencies. |
| npm run dev | Launches local development compiler on port 5173. |
| npm run build | Compiles an optimized distribution bundle into /dist. |

------------------------------



[1] [https://www.youtube.com](https://www.youtube.com/watch?v=AdkNcFUsRQQ)
[2] [https://dev.to](https://dev.to/lord_potato_c8a8c0086ffb5/tailwind-css-v4-vite-react-setup-the-clean-way-338j)
[3] [https://dev.to](https://dev.to/charan_gutti_cf60c6185074/vite-electron-in-simple-terms-and-its-setup-119n)
[4] [https://focusreactive.com](https://focusreactive.com/what-is-vercel/)
[5] [https://www.serverless.com](https://www.serverless.com/blog/preview-deployments)
[6] [https://medium.com](https://medium.com/@risa.lestari2002/step-by-step-guide-to-adding-microsoft-clarity-to-your-next-js-vercel-application-e7c3859fcd16)
[7] [https://adminlte.io](https://adminlte.io/blog/tailwind-portfolio-templates/)
[8] [https://pages.edgeone.ai](https://pages.edgeone.ai/templates/vite-react)
[9] [https://www.pluralsight.com](https://www.pluralsight.com/labs/codeLabs/guided-using-vite-with-react)
[10] [https://v4.vite.dev](https://v4.vite.dev/guide/cli)
