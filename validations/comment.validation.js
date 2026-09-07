const Joi = require('joi');

const createCommentSchema = Joi.object({
  text: Joi.string()
    .trim()
    .min(1)
    .required()
    .messages({
      'string.base': 'Comment text must be a string',
      'string.empty': 'Comment text is required',
      'string.min': 'Comment text must be at least 1 character',
      'any.required': 'Comment text is required',
    }),
});

module.exports = {
  createCommentSchema,
};
