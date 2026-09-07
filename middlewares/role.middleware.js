const AppError = require('../utils/AppError');

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(
        new AppError('Authentication required', 401)
      );
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AppError(
          'You do not have permission to perform this action',
          403
        )
      );
    }

    next();
  };
};

const isOwnerOrAdmin = (ownerId, user) => {
  if (!user) {
    return false;
  }

  if (user.role === 'admin') {
    return true;
  }

  return ownerId.toString() === user.id.toString();
};

module.exports = {
  authorize,
  isOwnerOrAdmin,
};