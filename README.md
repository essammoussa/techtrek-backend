# Blog API (MVC + JWT + Joi)

## Setup
1. Install dependencies:
   - `npm install`
2. Create env file:
   - copy `.env.example` to `.env`
3. Fill required vars:
   - `PORT`
   - `MONGO_URI`
   - `JWT_SECRET`
   - `JWT_EXPIRES_IN`
4. Run:
   - dev: `npm run dev`
   - prod: `npm start`

## Core routes
- Auth: `/api/auth`
- Users: `/api/users` (to be wired by user module)
- Posts: `/api/posts` (to be wired by post module)
- Nested comments create: `POST /api/posts/:postId/comments`
- Comment delete: `DELETE /api/comments/:id`

## Error handling
- Centralized middleware: `middlewares/error.middleware.js`
- Handles:
  - AppError status codes
  - Mongoose validation (400)
  - Duplicate key (400)
  - Invalid ObjectId cast (404)
  - JWT invalid/expired (401)
  - Unknown errors (500 with generic message only)

## Team QA assets
- Postman collection: `qa/Blog-System.postman_collection.json`
- Integration notes: `qa/integration-test-notes.txt`

## Testing
- Import the Postman collection from `qa/Blog-System.postman_collection.json`.
- Use collection variables:
  - `baseUrl` (default: `http://localhost:5000`)
  - `token`, `tokenUser2`, `adminToken`
  - `postId`, `commentId`
- Follow the ordered flow in `qa/integration-test-notes.txt` to verify 200/201/400/401/403/404/429 behavior.

## Utilities usage examples
`utils/asyncWrapper.js`:
```js
exports.getSomething = asyncWrapper(async (req, res) => {
  const data = await Model.find();
  res.status(200).json({ success: true, data });
});
```

`utils/AppError.js`:
```js
if (!resource) {
  return next(new AppError('Resource not found', 404));
}
```
