# MERN Stack - Week 4 (Days 9, 10, & 11)

Welcome to Week 4 of the MERN Stack learning journey! This week covers essential fundamentals for both the **Frontend** and **Backend**, laying the groundwork for a full-stack Blog Post application. 

This repository is split into two main directories:
- `backend/`: Contains the server-side code (Node.js, Express, MongoDB).
- `frontend/`: Contains the client-side code (HTML, CSS, JavaScript basics).

---

## 🛠️ Backend (Blog Post API)

The backend is an Express-based REST API designed to serve a Blog Post application. It connects to a MongoDB database using Mongoose and incorporates role-based access control (RBAC).

### Key Features
1. **Express Server Setup**: A robust server utilizing `express`, `dotenv`, and `cookie-parser`.
2. **Database Integration**: Connected to a MongoDB cluster using `mongoose`.
3. **Role-Based APIs**: Modularized routing based on user roles:
   - `/user-api`: Endpoints tailored for regular users.
   - `/author-api`: Endpoints tailored for blog authors (e.g., creating/editing articles).
   - `/admin-api`: Endpoints tailored for admins (e.g., managing users and system data).
   - `/auth`: Common API endpoints for User Registration and Authentication.
4. **Global Error Handling**: Custom middleware to handle `ValidationError`, `CastError`, and generic server-side errors smoothly.

### Database Models
- **User Schema**: Stores user details (`firstName`, `lastName`, `email`, `password`, `role`, `profileImageUrl`).
- **Article Schema**: Stores blog content (`author`, `title`, `category`, `content`, `comments`, `isArticleActive`).

### How to Run the Backend
1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` folder and add necessary environment variables (e.g., `PORT`, `DB_URL`).
4. Start the server:
   ```bash
   node server.js
   ```

---

## 🎨 Frontend (UI Fundamentals)

The frontend section focuses on the building blocks of the web: HTML, CSS, and basic UI design principles. 

### Key Concepts Covered
- **Dynamic & Responsive UIs**: How pages render in the browser.
- **HTML**: Structuring web pages using semantic tags. 
- **CSS**: Styling elements, layout basics, and understanding the user-agent default stylesheet.
- **Assignments**: Includes practical implementations (`assignment7` and `assignment8`) to practice responsive design and layout formatting.

### Notes on Frontend Architecture
- The default styling applied by browsers (e.g., `h1` being `32px` by default).
- The difference between block-level and inline elements (e.g., `img` is an inline element).
- Preparatory concepts for upcoming libraries and frameworks like **ReactJS**, **Angular**, **Vue**, and **Next.js**.

### How to Run the Frontend
You can open any of the HTML files (e.g., `index.html`, `index2.html`, `index3.html`) directly in your web browser or use a tool like VS Code's **Live Server** extension to view them dynamically.

---

## 📝 Technologies Used
- **Backend**: Node.js, Express.js, Mongoose, bcryptjs, jsonwebtoken, cookie-parser, dotenv
- **Frontend**: HTML5, CSS3
