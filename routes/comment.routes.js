const express = require('express');

const protect = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const {
  createCommentSchema,
} = require('../validations/comment.validation');
const {
  createComment,
  deleteComment,
} = require('../controllers/comment.controller');

const postCommentRoutes = express.Router({ mergeParams: true });
const commentRoutes = express.Router();

postCommentRoutes.post(
  '/',
  protect,
  validate(createCommentSchema),
  createComment
);

commentRoutes.delete('/:id', protect, deleteComment);

module.exports = {
  postCommentRoutes,
  commentRoutes,
};
