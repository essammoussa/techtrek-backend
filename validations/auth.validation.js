const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .required()
    .messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 3 characters',
      'any.required': 'Name is required',
    }),

  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email',
      'string.empty': 'Email is required',
      'any.required': 'Email is required',
    }),

  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': 'Password must be at least 6 characters',
      'string.empty': 'Password is required',
      'any.required': 'Password is required',
    }),
});

const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email',
      'string.empty': 'Email is required',
      'any.required': 'Email is required',
    }),

  password: Joi.string()
    .required()
    .messages({
      'string.empty': 'Password is required',
      'any.required': 'Password is required',
    }),
});

module.exports = {
  registerSchema,
  loginSchema,
};