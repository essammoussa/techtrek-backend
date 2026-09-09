# TechKtrek — Blog API

> A production-ready RESTful API for a full-featured blog system built with **Node.js**, **Express**, and **MongoDB**. Supports authentication, role-based access control, image uploads, Joi validation, and rate limiting.

---

## ✨ Features

| Feature | Details |
|---|---|
| 🔐 **JWT Authentication** | Stateless auth with signed tokens; protected routes via middleware |
| 👥 **Role-Based Access Control** | `user` and `admin` roles with granular route-level authorization |
| 📝 **Posts CRUD** | Create, read, update, and delete blog posts with cover image upload |
| 💬 **Nested Comments** | Add comments to posts (`POST /api/posts/:postId/comments`) and delete them |
| 👤 **User Management** | Profile updates with avatar upload; admin-only list & delete |
| 🖼️ **File Uploads** | Multer disk storage with MIME-type & extension validation (JPEG, PNG, WebP, max 5 MB) |
| ✅ **Joi Validation** | Schema-based request validation on every mutating endpoint |
| 🛡️ **Security Headers** | Helmet middleware applied globally |
| 🚦 **Rate Limiting** | Login endpoint capped at 10 requests per 15-minute window |
| ⚠️ **Centralised Error Handling** | Single error middleware handles AppError, Mongoose, JWT, and unknown errors |
| 🏥 **Health Check** | `GET /api/health` endpoint for uptime monitoring |

---

## 🗂️ Project Structure

```
techktrek-backend/
├── app.js                    # Express app setup, global middleware, routes
├── server.js                 # HTTP server entry point
├── config/                   # Database connection config
├── controllers/
│   ├── auth.controller.js    # register / login
│   ├── user.controller.js    # getAllUsers, getUserById, updateUser, deleteUser
│   ├── post.controller.js    # createPost, getPosts, getPostById, updatePost, deletePost
│   └── comment.controller.js # createComment, deleteComment
├── middlewares/
│   ├── auth.middleware.js    # JWT verification (protect)
│   ├── role.middleware.js    # Role-based authorization (authorize)
│   ├── validate.middleware.js # Joi schema validation
│   ├── upload.middleware.js  # Multer file upload (disk storage)
│   └── error.middleware.js   # Centralised error handler
├── models/
│   ├── User.model.js         # name, email, password, role, avatar
│   ├── Post.model.js         # title, content, author, category, tags, coverImage, isPublished
│   └── Comment.model.js      # content, author, post reference
├── routes/
│   ├── auth.routes.js
│   ├── user.routes.js
│   ├── post.routes.js
│   └── comment.routes.js
├── validations/              # Joi schemas for auth, users, posts, comments
├── utils/
│   ├── AppError.js           # Custom operational error class
│   └── asyncWrapper.js       # Async/await error-catching wrapper
├── uploads/                  # Persisted uploaded images (gitignored)
├── qa/
│   ├── Blog-System.postman_collection.json
│   └── integration-test-notes.txt
└── .env.example
```

---

## 🌐 API Endpoints

### Auth — `/api/auth`

| Method | Endpoint | Auth | Body |
|--------|----------|------|------|
| `POST` | `/register` | ❌ | `name`, `email`, `password` |
| `POST` | `/login` | ❌ | `email`, `password` — *rate limited* |

### Users — `/api/users`

| Method | Endpoint | Auth | Role | Notes |
|--------|----------|------|------|-------|
| `GET` | `/` | ✅ | admin | List all users |
| `GET` | `/:id` | ✅ | any | Get user by ID |
| `PUT` | `/:id` | ✅ | any | Update profile; supports `avatar` file upload |
| `DELETE` | `/:id` | ✅ | admin | Delete user |

### Posts — `/api/posts`

| Method | Endpoint | Auth | Notes |
|--------|----------|------|-------|
| `GET` | `/` | ❌ | List all posts (public) |
| `GET` | `/:id` | ❌ | Get single post (public) |
| `POST` | `/` | ✅ | Create post; supports `coverImage` file upload |
| `PUT` | `/:id` | ✅ | Update post; supports `coverImage` file upload |
| `DELETE` | `/:id` | ✅ | Delete post |

### Comments

| Method | Endpoint | Auth | Notes |
|--------|----------|------|-------|
| `POST` | `/api/posts/:postId/comments` | ✅ | Create comment on a post |
| `DELETE` | `/api/comments/:id` | ✅ | Delete comment by ID |

### Health

| Method | Endpoint | Auth | Response |
|--------|----------|------|----------|
| `GET` | `/api/health` | ❌ | `{ status: "ok" }` |

---

## 📦 Packages & Libraries

### Production Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| [express](https://expressjs.com/) | `^4.19.2` | Web framework — routing, middleware, request/response |
| [mongoose](https://mongoosejs.com/) | `^8.5.0` | MongoDB ODM — schema definition, validation, queries |
| [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) | `^9.0.3` | JWT creation and verification for stateless auth |
| [bcryptjs](https://github.com/dcodeIO/bcrypt.js) | `^2.4.3` | Password hashing and comparison |
| [joi](https://joi.dev/) | `^17.13.7` | Schema-based request body/query validation |
| [multer](https://github.com/expressjs/multer) | `^1.4.5-lts.1` | Multipart file upload handling (disk storage) |
| [express-rate-limit](https://github.com/express-rate-limit/express-rate-limit) | `^7.5.1` | Rate limiting middleware (login brute-force protection) |
| [helmet](https://helmetjs.github.io/) | `^7.1.0` | Sets security-related HTTP headers |
| [cors](https://github.com/expressjs/cors) | `^2.8.5` | Cross-Origin Resource Sharing headers |
| [dotenv](https://github.com/motdotla/dotenv) | `^16.4.5` | Loads environment variables from `.env` |

### Development Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| [nodemon](https://nodemon.io/) | `^3.1.4` | Auto-restarts the server on file changes during development |

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
```

| Variable | Description |
|----------|-------------|
| `PORT` | Port the server listens on |
| `MONGO_URI` | MongoDB connection string (Atlas or local) |
| `JWT_SECRET` | Secret key used to sign JWT tokens |
| `JWT_EXPIRES_IN` | Token expiry duration (e.g. `7d`, `1h`) |

---

## 🚀 Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/essammoussa/techtrek-backend.git
cd techtrek-backend

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env and fill in MONGO_URI, JWT_SECRET, etc.

# 4. Run in development mode (auto-reload)
npm run dev

# 5. Run in production mode
npm start
```

---

## 🛡️ Error Handling

The centralised error middleware (`middlewares/error.middleware.js`) handles:

| Scenario | HTTP Status |
|----------|-------------|
| Custom `AppError` | As specified |
| Mongoose validation error | `400` |
| Duplicate key (unique field) | `400` |
| Invalid ObjectId cast | `404` |
| JWT invalid signature | `401` |
| JWT expired | `401` |
| Unhandled / unknown errors | `500` (generic message only, no leak) |

---

## 🧰 Utility Helpers

**`utils/asyncWrapper.js`** — Eliminates repetitive `try/catch` blocks:

```js
exports.getPosts = asyncWrapper(async (req, res) => {
  const posts = await Post.find();
  res.status(200).json({ success: true, data: posts });
});
```

**`utils/AppError.js`** — Operational error with a custom status code:

```js
if (!post) {
  return next(new AppError('Post not found', 404));
}
```

---

## 🧪 QA & Testing

The `qa/` directory contains a Postman collection and integration test notes:

1. Import `qa/Blog-System.postman_collection.json` into Postman.
2. Set collection variables:
   - `baseUrl` — default `http://localhost:5001`
   - `token`, `tokenUser2`, `adminToken`
   - `postId`, `commentId`
3. Follow the ordered flow in `qa/integration-test-notes.txt` to verify all expected status codes: `200`, `201`, `400`, `401`, `403`, `404`, `429`.

---

## 📄 License

This project is for educational and team collaboration purposes as part of the **TechKtrek** program.
