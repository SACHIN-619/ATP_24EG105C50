It is freelancer bid portal websites.

Techstacks:
  - MERNSTACK

  # Step 1: Initialize Backend

npm init -y
npm install express mongoose cors dotenv
npm i express dotenv mongoose cookie-parser cors jsonwebtoken bcryptjs
npm install nodemon

# step 2: Basic express server : 

- backend/
 ├── models/
 ├── routes/
 ├── controllers/
 ├── middleware/
 ├── config/
 └── server.js
 

 import Login from "./pages/Login";
6  |  import Signup from "./pages/Signup";
7  |  import ClientDashboard from "./pages/ClientDashboard";
   |                               
8  |  import StudentDashboard from "./pages/StudentDashboard";
9  |  import ProjectsList from "./pages/ProjectsList";



# UX flows (v3): 
 - Client adds milestones → Student marks done (with note) →     Client approves (virtual payment released) or rejects (sent back for rework)