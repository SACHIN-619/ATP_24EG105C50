Here is your complete, updated Root README file with the new environment variables, startup commands, and key features sections integrated seamlessly. All icons and emojis have been completely removed.
## Freelancer Bid Portal (MERN Stack)
A comprehensive Freelancer Bidding Portal built with the MERN Stack (MongoDB, Express, React, Node.js). This application enables clients to post projects with full budget control, allows students/freelancers to submit proposals and bids, tracks project lifecycles with dynamic milestones, and utilizes real-time style overrides via a centralized layout system.
## Live Deployments

* Frontend Client (Vercel): vercel.app
* Backend Service (Render API): onrender.com

------------------------------
## Key Features

* Role-Based Access Control (RBAC): Strict separation of matching layouts and route permissions between Clients (project creators) and Students (freelancers) enforced via custom multi-layered backend Express guards.
* Real-Time Notification Engine (V4 Update): Contextual tracking systems built across both sides of the application with automated 30-second interval client polling loops to track bid adjustments, reviews, and updates.
* Dynamic Milestone Management System (V3 Update): Fully integrated client-student lifecycle tracking allowing modular breakdown of delivery dates, custom progress bars, and secure virtual token payment releases.
* Smart Theming Canvas (V4 Update): Complete implementation of full dark/light layout modifications powered natively through CSS properties and stateful Tailwind CSS v4 variables with standard local persistence.
* Cryptographic Security Layer: Zero plain-text data footprints achieved through state-of-the-art bcryptjs password hashing and state verification using secure jsonwebtoken signatures.

------------------------------
## Architecture and Monorepo Structure

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


