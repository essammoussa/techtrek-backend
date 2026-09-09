const Joi = require('joi');

// فاليديشن إنشاء مقال جديد
const createPostSchema = Joi.object({
  title: Joi.string().trim().min(5).required().messages({
    'string.base': 'Title must be a type of text',
    'string.empty': 'Title cannot be an empty field',
    'string.min': 'Title should have a minimum length of 5 characters',
    'any.required': 'Title is a required field'
  }),
  content: Joi.string().min(10).required().messages({
    'string.base': 'Content must be a type of text',
    'string.empty': 'Content cannot be an empty field',
    'string.min': 'Content should have a minimum length of 10 characters',
    'any.required': 'Content is a required field'
  }),
  category: Joi.string().trim().required().messages({
    'string.base': 'Category must be a type of text',
    'string.empty': 'Category cannot be an empty field',
    'any.required': 'Category is a required field'
  }),
  tags: Joi.array().items(Joi.string()).optional(),
  isPublished: Joi.boolean().optional()
});

// فاليديشن تحديث المقال (كل الحقول بتبقى اختيارية وقت التعديل)
const updatePostSchema = Joi.object({
  title: Joi.string().trim().min(5).optional(),
  content: Joi.string().min(10).optional(),
  category: Joi.string().trim().optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  isPublished: Joi.boolean().optional()
});

module.exports = {
  createPostSchema,
  updatePostSchema
};