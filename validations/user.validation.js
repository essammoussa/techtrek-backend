const Joi = require('joi');

const updateUserSchema = Joi.object({
  name: Joi.string().min(3).trim().optional(),

  email: Joi.string().email().lowercase().trim().optional(),
});

module.exports = {
  updateUserSchema,
};