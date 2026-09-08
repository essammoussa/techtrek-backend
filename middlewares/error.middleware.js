const AppError = require('../utils/AppError');

const handleMongooseValidationError = (err) => {
  const errors = Object.values(err.errors).map(
    (detail) => ({
      field: detail.path,
      message: detail.message,
    })
  );

  return {
    statusCode: 400,
    message: 'Validation failed',
    errors,
  };
};

const handleDuplicateKeyError = (err) => {
  const duplicatedFields = Object.keys(err.keyValue || {}).map(
    (field) => ({
      field,
      message: `${field} already exists`,
    })
  );

  return {
    statusCode: 400,
    message: 'Validation failed',
    errors: duplicatedFields,
  };
};

const handleCastError = () => ({
  statusCode: 404,
  message: 'Resource not found',
});

const handleJwtError = () => ({
  statusCode: 401,
  message: 'Invalid token. Please log in again.',
});

const handleJwtExpiredError = () => ({
  statusCode: 401,
  message: 'Token expired. Please log in again.',
});

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || 'Internal server error';
  let errors;

  if (err.name === 'ValidationError') {
    const mappedError = handleMongooseValidationError(err);
    statusCode = mappedError.statusCode;
    message = mappedError.message;
    errors = mappedError.errors;
  } else if (err.code === 11000) {
    const mappedError = handleDuplicateKeyError(err);
    statusCode = mappedError.statusCode;
    message = mappedError.message;
    errors = mappedError.errors;
  } else if (err.name === 'CastError') {
    const mappedError = handleCastError();
    statusCode = mappedError.statusCode;
    message = mappedError.message;
  } else if (err.name === 'JsonWebTokenError') {
    const mappedError = handleJwtError();
    statusCode = mappedError.statusCode;
    message = mappedError.message;
  } else if (err.name === 'TokenExpiredError') {
    const mappedError = handleJwtExpiredError();
    statusCode = mappedError.statusCode;
    message = mappedError.message;
  } else if (!(err instanceof AppError) && statusCode >= 500) {
    message = 'Internal server error';
  }

  const payload = {
    success: false,
    message,
  };

  if (errors) {
    payload.errors = errors;
  }

  res.status(statusCode).json(payload);
};

module.exports = errorHandler;
