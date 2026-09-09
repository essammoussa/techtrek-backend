const Post = require('../models/Post.model');
const AppError = require('../utils/AppError');
const asyncWrapper = require('../utils/asyncWrapper');

// 1. إنشاء مقال جديد
const createPost = asyncWrapper(async (req, res, next) => {
  const { title, content, category, tags, isPublished } = req.body;

  // لو فيه صورة مرفوعة عن طريق Multer، خد المسار بتاعها
  let coverImage = undefined;
  if (req.file) {
    coverImage = req.file.path;
  }

  const post = await Post.create({
    title,
    content,
    category,
    tags,
    isPublished,
    coverImage,
    author: req.user._id // بيتاخد من التوكن عبر الـ auth middleware
  });

  res.status(201).json({
    status: 'success',
    data: {
      post
    }
  });
});

// 2. جلب كل المقالات مع دعم (Pagination, Search, Filtering, Sorting)
const getPosts = asyncWrapper(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  // بناء الفلتر
  let query = {};

  if (req.query.category) {
    query.category = req.query.category;
  }

  if (req.query.author) {
    query.author = req.query.author;
  }

  // البحث في العنوان أو المحتوى باستخدام Regex
  if (req.query.search) {
    query.$or = [
      { title: { $regex: req.query.search, $options: 'i' } },
      { content: { $regex: req.query.search, $options: 'i' } }
    ];
  }

  // الترتيب (الافتراضي الأحدث أولاً)
  let sortBy = '-createdAt';
  if (req.query.sort) {
    sortBy = req.query.sort.split(',').join(' ');
  }

  const posts = await Post.find(query)
    .populate('author', 'name email avatar')
    .sort(sortBy)
    .skip(skip)
    .limit(limit);

  const total = await Post.countDocuments(query);

  res.status(200).json({
    status: 'success',
    results: posts.length,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit)
    },
    data: {
      posts
    }
  });
});

// 3. جلب مقال واحد بالـ ID مع الكاتب والكومنتات
const getPostById = asyncWrapper(async (req, res, next) => {
  const post = await Post.findById(req.params.id)
    .populate('author', 'name email avatar');

  if (!post) {
    return next(new AppError('No post found with that ID', 404));
  }

  // جلب الكومنتات الخاصة بالمقال ده (تأكد من وجود نموذج Comment أو اربطه لاحقاً مع زميلك)
  // هنفترض هنا جلب الكومنتات المرتبطة بالمقال لو موديل Comment مربوط
  const comments = await mongoose.model('Comment').find({ post: post._id }).populate('user', 'name avatar');

  res.status(200).json({
    status: 'success',
    data: {
      post,
      comments
    }
  });
});

// 4. تحديث مقال (صاحب المقال أو الإدمن فقط)
const updatePost = asyncWrapper(async (req, res, next) => {
  let post = await Post.findById(req.params.id);

  if (!post) {
    return next(new AppError('No post found with that ID', 404));
  }

  // التحقق من الملكية أو صلاحية الإدمن
  if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new AppError('You do not have permission to perform this action', 403));
  }

  const updateData = { ...req.body };
  if (req.file) {
    updateData.coverImage = req.file.path;
  }

  post = await Post.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      post
    }
  });
});

// 5. حذف مقال (صاحب المقال أو الإدمن فقط)
const deletePost = asyncWrapper(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new AppError('No post found with that ID', 404));
  }

  // التحقق من الملكية أو صلاحية الإدمن
  if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new AppError('You do not have permission to perform this action', 403));
  }

  await Post.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'success',
    data: null
  });
});

module.exports = {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost
};