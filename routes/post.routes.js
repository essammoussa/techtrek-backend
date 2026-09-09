const express = require('express');
const {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost
} = require('../controllers/post.controller');

const authMiddleware = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');
const validate = require('../middlewares/validate.middleware');
const { createPostSchema, updatePostSchema } = require('../validations/post.validation');

const router = express.Router();

// المسارات العامة (متاحة للكل)
router.get('/', getPosts);
router.get('/:id', getPostById);

// المسارات المحمية (تحتاج تسجيل دخول وصلاحيات)
router.use(authMiddleware); // أي مسار تحت السطر ده لازم يكون المستخدم مسجل دخول

router.post('/', upload.single('coverImage'), validate(createPostSchema), createPost);
router.put('/:id', upload.single('coverImage'), validate(updatePostSchema), updatePost);
router.delete('/:id', deletePost);

module.exports = router;