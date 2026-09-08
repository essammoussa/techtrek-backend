const Comment = require('../models/Comment.model');
const Post = require('../models/Post.model');
const AppError = require('../utils/AppError');
const asyncWrapper = require('../utils/asyncWrapper');
const { isOwnerOrAdmin } = require('../middlewares/role.middleware');

const createComment = asyncWrapper(async (req, res, next) => {
  const { postId } = req.params;
  const { text } = req.body;

  const postExists = await Post.exists({ _id: postId });

  if (!postExists) {
    return next(new AppError('Post not found', 404));
  }

  const comment = await Comment.create({
    text,
    post: postId,
    user: req.user.id,
  });

  await comment.populate({
    path: 'user',
    select: 'name email role avatar',
  });

  return res.status(201).json({
    success: true,
    message: 'Comment created successfully',
    data: comment,
  });
});

const deleteComment = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const comment = await Comment.findById(id).select('user');

  if (!comment) {
    return next(new AppError('Comment not found', 404));
  }

  if (!isOwnerOrAdmin(comment.user, req.user)) {
    return next(
      new AppError(
        'You do not have permission to perform this action',
        403
      )
    );
  }

  await comment.deleteOne();

  return res.status(200).json({
    success: true,
    message: 'Comment deleted successfully',
  });
});

module.exports = {
  createComment,
  deleteComment,
};
