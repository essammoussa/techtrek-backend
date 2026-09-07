const jwt = require('jsonwebtoken');

const AppError = require('../utils/AppError');
const asyncWrapper = require('../utils/asyncWrapper');

const protect = asyncWrapper(async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;

  if (
    authHeader &&
    authHeader.startsWith('Bearer ')
  ) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError(
        'Authentication required. Please provide a token.',
        401
      )
    );
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();
  } catch (error) {
    return next(
      new AppError('Invalid or expired token', 401)
    );
  }
});

module.exports = protect;