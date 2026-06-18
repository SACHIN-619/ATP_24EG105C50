
## Backend API Service (Node.js and Express)
This directory contains the production core engine for the Freelancer Bid Portal. It implements a secure REST API architecture using Mongoose, features dual-layered route decorators, runs cryptographic validation checks, and enforces data schema validation rules directly at the server level. [1] 
## Environment Configuration
Create a .env file within the backend/ directory to securely store access credentials: [2] 

PORT=5000
MONGO_URI=mongodb://<db_user>:<password>@ac-wrm3lbc-shard-00-00.do1vozt.mongodb.net:27017,ac-wrm3lbc-shard-00-01.do1vozt.mongodb.net:27017,ac-wrm3lbc-shard-00-02.do1vozt.mongodb.net:27017/Freelance_bid?ssl=true&replicaSet=atlas-11zodi-shard-0&authSource=admin&appName=Freelance_bid
CLIENT_URL=http://localhost:5173
JWT_SECRET=your_super_secure_jwt_secret_phrase

Cloud Strategy Note: The custom multi-shard MongoDB connection string format listed above bypasses standard DNS processing hurdles on cloud containers like Render by establishing direct pipelines to explicit shard clusters.
------------------------------
## Middleware Guard Systems

* auth.js (JWT Authentication Guard): Intercepts outbound browser payloads, strips the cryptographic string from the request headers, verifies it against the server's JWT_SECRET, and mounts the current validated user profile onto req.user. [3] 
* roleCheck.js (Access Control Guard): Runs directly after the authentication guard. It compares req.user.role with explicit access whitelist parameters, automatically throwing a 403 Forbidden response if there is a role mismatch.

router.post('/create', protect, roleCheck('client'), createProject);

------------------------------
## Production API Reference Matrix## Authentication Endpoints

| Method [4, 5] | Endpoint | Description | Guard System |
|---|---|---|---|
| POST | /api/auth/register | Registers a new user; auto-hashes passwords via a pre-save hook | None |
| POST | /api/auth/login | Compares candidate passwords and issues long-lived JWTs | None |

## Bidding and Project Endpoints

| Method | Endpoint | Description | Guard System |
|---|---|---|---|
| GET | /api/projects | Fetches active projects (supports server-side filters via tags) | Private |
| GET | /api/projects/mine | Fetches projects created by the authenticated owner | Client Only |
| POST | /api/bids/:id | Submits a freelancing bid proposal for a specific project ID | Student Only |

## Milestone Tracking Endpoints (V3 Update)

| Method | Endpoint | Description | Guard System |
|---|---|---|---|
| POST | /api/milestones | Adds a new milestone (verifies total milestones stay within project budget) | Client Only |
| PUT | /api/milestones/:id/complete | Submits work notes and marks a milestone as complete | Student Only |
| PUT | /api/milestones/:id/approve | Approves completed milestones and releases virtual payments | Client Only |

## Notification Endpoints (V4 Update)

| Method | Endpoint | Description | Guard System |
|---|---|---|---|
| GET | /api/notifications | Fetches system notifications and system updates for the current user | Private |

------------------------------
## Available Command Scripts
Run these commands inside the backend/ subdirectory:

| Command [6, 7] | Action |
|---|---|
| npm install | Downloads server dependencies. |
| npm start | Starts the production server engine using standard node server.js. |
| npm run dev | Launches the server in development mode with nodemon file-watching. |

------------------------------

[1] [https://medium.com](https://medium.com/@AmmarAlmuain/building-a-secure-authentication-with-express-js-mongoose-realm-in-typescript-d8f1e442f31d)
[2] [https://dev.to](https://dev.to/chrismbah/how-to-build-a-simple-rest-api-with-node-express-and-mongodb-2d4n)
[3] [https://www.techmarcos.com](https://www.techmarcos.com/nodejs-rbac-implementation-guide/)
[4] [https://dev.to](https://dev.to/davydocsurg/mastering-docker-for-nodejs-advanced-techniques-and-best-practices-55m9)
[5] [https://medium.com](https://medium.com/nerd-for-tech/registration-login-using-the-mongodb-to-store-data-in-expressjs-dba79c8886f2)
[6] [https://codewithhugo.com](https://codewithhugo.com/node-postgres-express-docker-compose/)
[7] [https://medium.com](https://medium.com/@agastyagaur/deploying-a-mern-stack-application-on-a-unified-server-a-step-by-step-guide-to-cost-free-hosting-a9c2eb0e23a1)
