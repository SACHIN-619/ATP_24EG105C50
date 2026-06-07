
# Backend
mkdir backend && cd backend
npm init -y
npm install express mongoose bcryptjs jsonwebtoken cors dotenv
node server.js
 
# Tasks  ( V3 )
 # Task 1 — Backend : Create Milestone.js, routes/   milestones.js, update server.js with two mount points

    Milestone model, full CRUD routes — create, complete, approve, reject, delete. Budget guard (total ≤ project budget). Role guards on every action.

 Every File Explained

# backend/ — The Server

# .env
Stores secret configuration that should never be committed to Git. Two variables:

    MONGO_URI — the connection string MongoDB uses to find your database. mongodb://localhost:27017/bid-portal means: local machine, port 27017, database named bid-portal.
    JWT_SECRET — a random string used to sign and verify tokens. If someone doesn't know this string, they can't forge a valid token.


# server.js — Entry Point
This is the first file Node runs. It does five things in order:
jsimport 'dotenv/config';        // 1. Load .env variables into process.env
connectDB();                   // 2. Connect to MongoDB
app.use(cors(...));            // 3. Allow frontend to talk to backend
app.use(express.json());       // 4. Parse incoming JSON request bodies
app.use('/api/...', routes);   // 5. Mount each router at its URL prefix
Without express.json(), req.body would always be undefined — you'd never receive the data a user submitted in a form.

# config/db.js — Database Connection
jsawait mongoose.connect(process.env.MONGO_URI);
This opens a persistent connection to MongoDB. It runs once when the server starts. process.exit(1) on failure means the server refuses to start without a database — which is correct, since nothing works without it.

# middleware/auth.js — JWT Guard
Middleware is a function that runs between receiving a request and executing the route handler. This one:
Request arrives → auth.js checks token → if valid, attach user to req → route handler runs
                                        → if invalid, send 401, stop here
It reads the Authorization header, which the frontend sends as Bearer eyJhbGci.... It calls jwt.verify() which cryptographically checks the token against your JWT_SECRET. If valid, it fetches the user from the database and attaches them to req.user so every route handler can access who is making the request.

# middleware/roleCheck.js — Role Guard
Runs after protect. Checks req.user.role against the allowed roles:
jsroleCheck('client')   // only clients get through
roleCheck('student')  // only students get through
This is why a student cannot create a project and a client cannot submit a bid — the server rejects it with 403 before the handler even runs.

#  models/User.js
A Mongoose Schema defines the shape of a document in MongoDB. Key things here:

unique: true on email — MongoDB creates an index that enforces no two users share an email.
userSchema.pre('save', ...) — a pre-save hook. Every time a User document is saved, if the password field changed, it auto-hashes it with bcrypt before writing to the database. Plain text passwords never touch the database.
matchPassword — an instance method added to every User object. Compares a plain text password to the stored hash using bcrypt.compare().


# models/Project.js

    clientId: { ref: 'User' } — this is a reference. MongoDB stores just the ObjectId, but when you call .populate('clientId') in a query, Mongoose automatically fetches the full User document and replaces the id with the object. This is how you get the client's name displayed on a project card.
    status with enum — MongoDB will reject any value not in the list, protecting data integrity.


# models/Bid.js
    Has references to both User (studentId) and Project (projectId). This is the join table equivalent in a relational database — it links a student to a project with their proposal details.

#  models/Review.js
-  The compound unique index:


        jsreviewSchema.index({ projectId: 1, clientId: 1, studentId: 1 }, { unique: true });
-  This enforces at the database level that a client can only leave one review per student per project. Even if the frontend has a bug, the database rejects a duplicate.

# models/Milestone.js
    Simple model. The interesting logic is in the route, not the model — specifically the budget guard that prevents the total milestone amounts from exceeding the project budget.

# routes/auth.js
- Two endpoints:
Signup: Creates a user → the pre-save hook hashes the password → returns a JWT token. The frontend receives this token and stores it in localStorage.
Login: Finds user by email → calls matchPassword() → if match, returns a new JWT token. The token contains { id: user._id } signed with the secret. Expires in 7 days.

# routes/projects.js
- Important design decisions:

/mine is declared before /:id. Express matches routes top to bottom. If /:id came first, the string "mine" would be treated as a MongoDB ObjectId, which would throw a cast error.
The accept bid route rejects all other bids in the same operation using updateMany, keeping the data consistent in one database round trip.


# routes/users.js

PUT /me lets users update their own profile. It uses req.user._id from the JWT (not from the request body), so a user can never update someone else's profile — even if they try to send a different id.
After a review is created, it immediately recomputes the student's average rating from all their reviews and writes it back to the User document. This is a denormalization — storing computed data for fast reads.


# routes/milestones.js
 - Business logic enforced server-side:

        Only the assigned student (verified via accepted Bid lookup) can mark a milestone complete.
        Only the project owner (verified by comparing clientId) can approve or reject.
        Approve sets status to approved (virtual payment released). Reject sets it back to pending (rework requested).
        Budget guard: sum of all existing milestone amounts + new amount must not exceed project.budget.