const express = require('express');

const router = express.Router();

const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require('../controllers/user.controller');

const protect = require('../middlewares/auth.middleware');

const {
  authorize,
} = require('../middlewares/role.middleware');

const validate = require('../middlewares/validate.middleware');

const {
  updateUserSchema,
} = require('../validations/user.validation');

const upload = require('../middlewares/upload.middleware');


// GET
router.get(
  '/',
  protect,
  authorize('admin'),
  getAllUsers
);


// GET by id
router.get(
  '/:id',
  protect,
  getUserById
);


// PUT
router.put(
  '/:id',
  protect,
  upload.single('avatar'),
  validate(updateUserSchema),
  updateUser
);
// DELETE
router.delete(
  '/:id',
  protect,
  authorize('admin'),
  deleteUser
);


module.exports = router;