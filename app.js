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

// --- Serve uploaded files statically ---
app.use('/uploads', express.static('uploads'));

// --- Simple health check ---
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// --- Routes ---
// Auth:
const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);

// Users:
const userRoutes = require('./routes/user.routes');
app.use('/api/users', userRoutes);

const {
  postCommentRoutes,
  commentRoutes,
} = require('./routes/comment.routes');
app.use('/api/posts/:postId/comments', postCommentRoutes);
app.use('/api/comments', commentRoutes);

// Posts — mounted AFTER nested comment routes
const postRoutes = require('./routes/post.routes');
app.use('/api/posts', postRoutes);

// --- 404 handler (for routes that don't match anything above) ---
app.use((req, res, next) => {
  next(new AppError('Route not found', 404));
});

// --- Centralized error handler ---
app.use(errorHandler);

module.exports = app;
