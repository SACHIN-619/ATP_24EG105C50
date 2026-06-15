Freelancer Bid Portal (MERN Stack) 
A comprehensive Freelancer Bidding Portal built with the MERN Stack (MongoDB, Express, React, Node.js). This application enables clients to post projects with full budget control, allows students/freelancers to submit proposals and bids, tracks project lifecycles with dynamic milestones, and utilizes real-time style overrides via a centralized layout system. [1, 2]  
🔗 Live Deployments 

• Frontend Client (Vercel):  https://freelancebid.vercel.app/ 
• Backend Service (Render API):  https://freelance-bid.onrender.com/ 

# Architecture & Monorepo Structure 
## Core Architectural Flows 
1. Dynamic Milestone UX Flow 
2. End-to-End MERN Data Flow 

1. Client Interaction: User interacts with a form → Local React states capture user input variables. 
2. API Handshake: Axios intercepts the submission, attaches the  header, and pipes an HTTP POST payload securely to Render. 
3. Server Validation: Express passes the incoming context through , hits the specialized router path, and executes authentication guards. 
4. Database Lifecycle: Mongoose fires hooks (e.g., auto-hashing raw text via ) and synchronizes state seamlessly with MongoDB Atlas. 
5. UI Synchronizer: The server responds with signed JWT records, structural models load into React Context, and  updates the layout dynamically. 

📦 Core Ecosystem & Dependencies 
Backend Packages 

• express: Minimalist web framework to handle clean routing paths and middleware chains. 
• mongoose: Object Document Mapper (ODM) enabling structured schemas and clean relational population queries. 
• bcryptjs: Cryptographic password-hashing with an iterative salt cost factor to prevent brute-force exposures. 
• jsonwebtoken: Issues and structurally validates secure JWT access tokens across server actions. 
• cors: Manages browser-enforced security rules by whitelisting specific production domains. 

Frontend Packages 

• react & react-dom: Virtual-DOM driven library powering modular, component-based user interfaces. 
• react-router-dom: Manages declarative dynamic routing paths on the client side without triggering hard page reloads. 
• axios: Advanced HTTP client configured with automated transformation adapters and request/response interceptors. 
• tailwindcss: Utility-first atomic engine executing design classes directly in line with UI components. 

# Local Development Quickstart 
1. Clone the Repo 
2. Launch Backend 
Follow the setup detailed in . 
3. Launch Frontend 
Follow the setup detailed in . 

