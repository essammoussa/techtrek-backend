const express = require('express');
const rateLimit = require('express-rate-limit');

const {
  register,
  login,
} = require('../controllers/auth.controller');

const validate = require('../middlewares/validate.middleware');

const {
  registerSchema,
  loginSchema,
} = require('../validations/auth.validation');

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,

  message: {
    success: false,
    message:
      'Too many login attempts. Please try again later.',
  },

  standardHeaders: true,
  legacyHeaders: false,
});

router.post(
  '/register',
  validate(registerSchema),
  register
);

router.post(
  '/login',
  loginLimiter,
  validate(loginSchema),
  login
);

module.exports = router;