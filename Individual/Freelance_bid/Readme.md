
## Freelancer Bid Portal (MERN Stack)
A comprehensive Freelancer Bidding Portal built with the MERN Stack (MongoDB, Express, React, Node.js). This application enables clients to post projects with full budget control, allows students/freelancers to submit proposals and bids, tracks project lifecycles with dynamic milestones, and utilizes real-time style overrides via a centralized layout system.
## Live Deployments

# Live Deployments
   * Frontend Client (Vercel): https://freelancebid.vercel.app/
   * Backend Service (Render API): https://freelance-bid.onrender.com/

------------------------------
## Key Features

* Role-Based Access Control (RBAC): Strict separation of matching layouts and route permissions between Clients (project creators) and Students (freelancers) enforced via custom multi-layered backend Express guards.
* Real-Time Notification Engine (V4 Update): Contextual tracking systems built across both sides of the application with automated 30-second interval client polling loops to track bid adjustments, reviews, and updates.
* Dynamic Milestone Management System (V3 Update): Fully integrated client-student lifecycle tracking allowing modular breakdown of delivery dates, custom progress bars, and secure virtual token payment releases.
* Smart Theming Canvas (V4 Update): Complete implementation of full dark/light layout modifications powered natively through CSS properties and stateful Tailwind CSS v4 variables with standard local persistence.
* Cryptographic Security Layer: Zero plain-text data footprints achieved through state-of-the-art bcryptjs password hashing and state verification using secure jsonwebtoken signatures.

# Leaderboard
 1. It Rewards Real Value Over Inactivity (Earnings First)The metric tier hierarchy ensures that your leaderboard does not lose its competitive edge. A student who has worked hard and completed real milestones to earn ₹15,000 will always rank higher than a student with ₹0 earnings, even if that inactive student somehow has a perfect $5.0$ star rating.
 2. It Handles the "New User Cold Start" FairlyRight now, your platform correctly shows 7 Students registered on the home page, but your leaderboard is totally empty. That is an awkward experience for new users. Showing everyone with $0$ earnings and $0$ projects gives everyone a starting line. They compete on verified quiz badges and ratings until they land their first contract.
 3. It Implements a Balanced Three-Tier Tie-BreakerWhen multiple students are sitting at ₹0 earnings (common at the start of a campus rollout), the sorting logic breaks ties beautifully:
 * Tier 1: Total Virtual Earnings (The ultimate hustle indicator)
 * Tier 2: Star Rating (Quality of execution)
 * Tier 3: Verified Skills/Badges (Academic test verification via your built-in quiz engines)
 * Tier 4: Portfolio Count (Preparation & effort—more items = higher rank).
* Tier 5: Total Skills listed (Profile completeness).
------------------------------
## Architecture and Monorepo Structure

.
├── backend/
│   ├── config/
│   │   └── (Database initialization configs)
│   ├── middleware/
│   │   └── (JWT authenticators and Role Guard checkers)
│   ├── models/
│   │   └── (MongoDB Data schemas: User, Project, Bid, Milestone, etc.)
│   ├── routes/
│   │   └── (API route declaration paths)
│   └── server.js
└── frontend/
    ├── index.css
    └── src/
        ├── api/
        │   └── (Axios global interceptors and configuration)
        ├── components/
        │   └── (Scannable standalone components: Navbar, Bell, etc.)
        ├── context/
        │   └── (State preservation: AuthContext, ThemeContext)
        └── pages/
            └── (Core application route screens)

------------------------------
## Core Architectural Flows## 1. Dynamic Milestone UX Flow

Client Creates Milestone 
       │
       ▼
Student Submits Task Notes 
       │
       ├──► Client Approves ──► Release Funds
       │
       └──► Client Rejects  ──► Rework Request

## 2. End-to-End MERN Data Flow

   1. Client Interaction: User interacts with a form -> Local React states capture user input variables.
   2. API Handshake: Axios intercepts the submission, attaches the Authorization: Bearer <token> header, and pipes an HTTP POST payload securely to Render.
   3. Server Validation: Express passes the incoming context through express.json(), hits the specialized router path, and executes authentication guards.
   4. Database Lifecycle: Mongoose fires hooks (e.g., auto-hashing raw text via bcryptjs) and synchronizes state seamlessly with MongoDB Atlas.
   5. UI Synchronizer: The server responds with signed JWT records, structural models load into React Context, and react-router-dom updates the layout dynamically.

------------------------------
## Core Ecosystem and Dependencies## Backend Packages

* express: Minimalist web framework to handle clean routing paths and middleware chains.
* mongoose: Object Document Mapper (ODM) enabling structured schemas and clean relational population queries.
* bcryptjs: Cryptographic password-hashing with an iterative salt cost factor to prevent brute-force exposures.
* jsonwebtoken: Issues and structurally validates secure JWT access tokens across server actions.
* cors: Manages browser-enforced security rules by whitelisting specific production domains.

## Frontend Packages

* react and react-dom: Virtual-DOM driven library powering modular, component-based user interfaces.
* react-router-dom: Manages declarative dynamic routing paths on the client side without triggering hard page reloads.
* axios: Advanced HTTP client configured with automated transformation adapters and request/response interceptors.
* tailwindcss: Utility-first atomic engine executing design classes directly in line with UI components.
- for css -> npm install @tailwindcss/vite  
------------------------------
## Local Development Quickstart
To run this project locally, you will need to configure environment variables for both the backend and frontend layers, then execute their respective startup scripts.
## Required Environment Variables## 1. Backend Variables (backend/.env)
Create a file named .env inside the backend folder and add:

PORT=5000
MONGO_URI=mongodb://localhost:27017/bid-portal
CLIENT_URL=http://localhost:5173
JWT_SECRET=your_super_secret_jwt_passphrase

## 2. Frontend Variables (frontend/.env)
Create a file named .env inside the frontend folder and add:

VITE_API_URL=http://localhost:5000

------------------------------
## Local Startup Commands
You will need to open two terminal windows to run both layers simultaneously during development:
## Terminal 1: Backend API Server

cd backend
npm install
npm run dev

(Launches the Node/Express server via nodemon on port 5000 with hot-reloading active).
## Terminal 2: Frontend Client UI

cd frontend
npm install
npm run dev

(Launches the Vite development compiler on port 5173 with Hot Module Replacement).
------------------------------
## Clone the Repo
If you have not cloned the repository yet, use the following commands:

git clone https://github.com
cd ATP_24EG105C50

------------------------------



