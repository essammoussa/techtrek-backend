const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const AppError = require('./utils/AppError');
const errorHandler = require('./middlewares/error.middleware');

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
const {
  postCommentRoutes,
  commentRoutes,
} = require('./routes/comment.routes');
app.use('/api/posts/:postId/comments', postCommentRoutes);
app.use('/api/comments', commentRoutes);

// --- 404 handler (for routes that don't match anything above) ---
app.use((req, res, next) => {
  next(new AppError('Route not found', 404));
});

// --- Centralized error handler ---
app.use(errorHandler);

module.exports = app;
