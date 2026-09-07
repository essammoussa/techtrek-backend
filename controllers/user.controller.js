const mongoose = require('mongoose');

const User = require('../models/User.model');
const AppError = require('../utils/AppError');
const asyncWrapper = require('../utils/asyncWrapper');
const { isOwnerOrAdmin } = require('../middlewares/role.middleware');


// GET /api/users
// Admin only
const getAllUsers = asyncWrapper(async (req, res, next) => {
  const users = await User.find().select('-password');

  res.status(200).json({
    success: true,
    count: users.length,
    users,
  });
});


// GET user by ID
const getUserById = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new AppError('User not found', 404));
  }

  const user = await User.findById(id).select('-password');

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.status(200).json({
    success: true,
    user,
  });
});


// PUT 
const updateUser = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new AppError('User not found', 404));
  }

  const user = await User.findById(id);

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  if (!isOwnerOrAdmin(user._id, req.user)) {
    return next(
      new AppError(
        'You do not have permission to update this user',
        403
      )
    );
  }

  const { name, email } = req.body;

  if (name !== undefined) {
    user.name = name;
  }

  if (email !== undefined) {
    user.email = email;
  }
  if (req.file) {
    user.avatar = `/uploads/${req.file.filename}`;
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: 'User updated successfully',
    user,
  });
});


// DELETE
const deleteUser = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new AppError('User not found', 404));
  }

  const user = await User.findById(id);

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  await User.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: 'User deleted successfully',
  });
});


module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};