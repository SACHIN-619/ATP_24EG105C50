
# Backend
mkdir backend && cd backend
npm init -y
npm install express mongoose bcryptjs jsonwebtoken cors dotenv
node server.js
 
# Tasks  ( V3 )
 # Task 1 — Backend (20 min): Create Milestone.js, routes/   milestones.js, update server.js with two mount points

    Milestone model, full CRUD routes — create, complete, approve, reject, delete. Budget guard (total ≤ project budget). Role guards on every action.