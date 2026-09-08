// Wraps an async controller function so any thrown/rejected error
// is automatically passed to Express's error-handling middleware.
//
// Usage:
//   exports.getUsers = asyncWrapper(async (req, res) => {
//     const users = await User.find();
//     res.status(200).json(users);
//   });
const asyncWrapper = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

module.exports = asyncWrapper;
