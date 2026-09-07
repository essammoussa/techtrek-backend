const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

// --- Global middleware ---
app.use(helmet());
app.use(cors());
app.use(express.json());

// --- Simple health check ---
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// --- Route placeholders ---
// Person 2 (Auth):
const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);

// Person 3 (Users):
// const userRoutes = require('./routes/user.routes');
// app.use('/api/users', userRoutes);

// Person 4 (Posts):
// const postRoutes = require('./routes/post.routes');
// app.use('/api/posts', postRoutes);

// Person 5 (Comments):
// const commentRoutes = require('./routes/comment.routes');
// app.use('/api/comments', commentRoutes);
// app.use('/api/posts/:postId/comments', commentRoutes); // nested route

// --- 404 handler (for routes that don't match anything above) ---
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// --- Centralized error handler ---
// Person 5 will replace this with middlewares/error.middleware.js
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Server error',
  });
});

module.exports = app;
