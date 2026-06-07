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



# Every Package Explained
 # Backend packages
    PackageWhy it's usedexpressWeb framework. Handles HTTP requests, routing, middleware chaining. Without it you'd write raw Node.js http server code which is verbose and error-prone.mongooseODM (Object Document Mapper) for MongoDB. Lets you define schemas, validate data, write User.find() instead of raw MongoDB queries, and use .populate() for joins.dotenvLoads .env file into process.env. Keeps secrets out of source code. import 'dotenv/config' is the ES module way — it runs immediately on import.bcryptjsHashes passwords using the bcrypt algorithm. Bcrypt is intentionally slow (cost factor 10 = 2^10 hash iterations) which makes brute-force attacks impractical. Never store plain text passwords.jsonwebtokenCreates and verifies JWTs. jwt.sign({id}, secret, {expiresIn}) creates a token. jwt.verify(token, secret) checks it hasn't been tampered with and isn't expired.corsBrowsers block cross-origin requests by default (your frontend on port 5173 cannot call your backend on port 5000 without permission). This package adds the Access-Control-Allow-Origin header.nodemonDev tool. Watches your files and auto-restarts the server when you save. Without it you'd manually stop and restart after every change.
  # Frontend packages
    PackageWhy it's usedreactThe UI library. Lets you write components — functions that return JSX (HTML-like syntax). Manages the virtual DOM and efficient re-renders when state changes.react-domConnects React to the actual browser DOM. ReactDOM.createRoot().render() is the bridge between React and the HTML page.react-router-domClient-side routing. Lets you navigate between pages without a full page reload. <Routes>, <Route>, useNavigate(), useParams() all come from here.axiosHTTP client. Cleaner than fetch — automatic JSON parsing, request/response interceptors, better error objects (err.response.data.message instead of manual parsing).tailwindcssUtility CSS framework. Instead of writing CSS files, you add class names directly to elements. Used minimally here — mostly for the hidden sm:flex responsive utility and fade-up animation classes. Most styling is done with inline style objects for precise control.viteBuild tool and dev server. Extremely fast — starts in under a second. Handles JSX transpilation, module bundling, and hot module replacement (page updates without full reload when you save).

# How It All Flows Together
User fills signup form
→ React state updates on each keystroke (useState)
→ handleSubmit calls api.post('/auth/signup', form)
→ Axios interceptor adds baseURL, sends HTTP POST to localhost:5000
→ Express receives it, runs express.json() to parse body
→ /api/auth router handles it
→ User.create() triggers pre-save hook → bcrypt hashes password
→ MongoDB stores the document
→ jwt.sign() creates a token containing the user's _id
→ Server responds with { name, email, role, token }
→ Axios receives response, returns it to the component
→ login(data) stores token in localStorage, user in React Context
→ navigate('/client/dashboard') changes the URL
→ React Router renders ClientDashboard
→ useEffect fires, calls api.get('/projects/mine')
→ Axios interceptor reads token from localStorage, adds Authorization header
→ protect middleware verifies token, attaches req.user
→ roleCheck('client') confirms role
→ Projects fetched from MongoDB, returned as JSON
→ React renders the project list
Every single step is necessary. Remove any one piece and the whole flow breaks.