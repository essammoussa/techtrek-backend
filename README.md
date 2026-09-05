Blog API — Node.js, Express & MongoDB

A RESTful API for a Blog System & User Management, built with Node.js, Express, MongoDB (Mongoose), JWT authentication, and Joi validation, following the MVC architecture.

Features
User registration & login with JWT authentication
Role-based access control (user / admin)
Blog posts with author relations, categories, tags, and cover images
Comments on posts, linked to both the post and the commenting user
Pagination, search, filtering, and sorting on posts
Request validation with Joi
Centralized error handling with proper HTTP status codes
Image uploads (avatars, cover images) via Multer
Tech Stack
Runtime: Node.js + Express
Database: MongoDB with Mongoose
Auth: JSON Web Tokens (jsonwebtoken) + bcryptjs
Validation: Joi
Uploads: Multer
Security: Helmet, CORS, express-rate-limit
Project Structure
project-root/
├── config/          # Database connection
├── controllers/     # Business logic per resource
├── middlewares/      # Auth, validation, error handling, uploads
├── models/          # Mongoose schemas (User, Post, Comment)
├── routes/          # Express route definitions
├── validations/     # Joi schemas
├── utils/           # Shared helpers (AppError, asyncWrapper)
├── uploads/         # Uploaded image files
├── .env             # Environment variables (not committed)
├── app.js           # Express app setup
└── server.js        # Entry point — connects DB & starts server
Getting Started
1. Clone the repository

git clone https://github.com/essammoussa/techtrek-backend.git
cd techtrek-backend

3. Install dependencies
npm install
4. Set up environment variables

Copy the example file and fill in your own values:

cp .env.example .env

Edit .env:

PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/blog-api?retryWrites=true&w=majority
JWT_SECRET=<a long random string>
JWT_EXPIRES_IN=7d

4. Run the server

Development (auto-restarts on file changes):

npm run dev or node server.js

If everything is set up correctly, you should see:

MongoDB connected: <host>
Server running on http://localhost:5000
5. Test it's working
bash
curl http://localhost:5000/api/health

Expected response:

json
{ "status": "ok" }
Testing the API

Use Postman or the Thunder Client VS Code extension to send requests.

Example — register a user:

Method: POST
URL: http://localhost:5000/api/auth/register
Body (JSON):
json
{
  "name": "Test User",
  "email": "test@test.com",
  "password": "123456"
}

For protected routes, add the JWT returned from login as a header:

Authorization: Bearer <token>
API Overview
Resource	Base Route
Auth	/api/auth
Users	/api/users
Posts	/api/posts
Comments	/api/posts/:postId/comments, /api/comments
Environment Variables
Variable	Description
PORT	Port the server runs on
MONGO_URI	MongoDB connection string
JWT_SECRET	Secret used to sign/verify JWTs
JWT_EXPIRES_IN	Token expiry (e.g. 7d)
