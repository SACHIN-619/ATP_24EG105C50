# Freelancer Bid Portal (MERN Stack)

A comprehensive Freelancer Bidding Portal built with the **MERN Stack** (MongoDB, Express, React, Node.js). This application enables clients to post projects with full budget control, allows students/freelancers to submit proposals and bids, tracks project lifecycles with dynamic milestones, and utilizes real-time style overrides via a centralized layout system.

## 🔗 Live Deployments
*  **Frontend Client (Vercel):** [https://freelancebid.vercel.app/](https://freelancebid.vercel.app/)
*  **Backend Service (Render API):** [https://freelance-bid.onrender.com/](https://freelance-bid.onrender.com/)

---

##  Architecture & Monorepo Structure

```text
├── backend/                  # Node.js, Express, and Mongoose Server layer
│   ├── config/               # Database initialization configs
│   ├── models/               # MongoDB Data schemas (User, Project, Bid, Milestone, etc.)
│   ├── middleware/           # JWT authenticators and Role Guard checkers
│   ├── routes/               # API route declaration paths
│   └── server.js             # API Gateway execution engine
│
├── frontend/                 # React client layer compiled with Vite
│   ├── src/
│   │   ├── api/              # Axios global interceptors and configuration
│   │   ├── context/          # State preservation (AuthContext, ThemeContext)
│   │   ├── components/       # Scannable standalone components (Navbar, Bell, etc.)
│   │   └── pages/            # Core application route screens
│   └── index.css             # Design tokens and global theme styling
# Core Architectural Flows
# 1. Dynamic Milestone UX Flow (V3)$$\text{Client Creates Milestone} \longrightarrow \text{Student Submits Task Notes} \longrightarrow \begin{cases} \text{Client Approves} \rightarrow \text{Release Funds} \\ \text{Client Rejects} \rightarrow \text{Rework Request} \end{cases}$$
# 2. End-to-End MERN Data FlowClient Interaction: User interacts with a form $\rightarrow$ Local React states capture user input variables.API Handshake: Axios intercepts the submission, attaches the Authorization: Bearer <token> header, and pipes an HTTP POST payload securely to Render.Server Validation: Express passes the incoming context through express.json(), hits the specialized router path, and executes authentication guards.Database Lifecycle: Mongoose fires hooks (e.g., auto-hashing raw text via bcryptjs) and synchronizes state seamlessly with MongoDB Atlas.UI Synchronizer: The server responds with signed JWT records, structural models load into React Context, and react-router-dom updates the layout dynamically.
#  Core Ecosystem & DependenciesBackend Packagesexpress: Minimalist web framework to handle clean routing paths and middleware chains.mongoose: Object Document Mapper (ODM) enabling structured schemas and clean relational population queries.bcryptjs: Cryptographic password-hashing with an iterative salt cost factor to prevent brute-force exposures.jsonwebtoken: Issues and structurally validates secure JWT access tokens across server actions.cors: Manages browser-enforced security rules by whitelisting specific production domains.Frontend Packagesreact & react-dom: Virtual-DOM driven library powering modular, component-based user interfaces.react-router-dom: Manages declarative dynamic routing paths on the client side without triggering hard page reloads.axios: Advanced HTTP client configured with automated transformation adapters and request/response interceptors.tailwindcss: Utility-first atomic engine executing design classes directly in line with UI components.
#  Local Development QuickstartClone the Repo:Bashgit clone [https://github.com/SACHIN-619/ATP_24EG105C50.git](https://github.com/SACHIN-619/ATP_24EG105C50.git)
cd ATP_24EG105C50
Launch Backend: Follow the setup detailed in /backend/README.md.Launch Frontend: Follow the setup detailed in /frontend/README.md.
