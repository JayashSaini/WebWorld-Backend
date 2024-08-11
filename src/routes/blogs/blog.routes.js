const { Router } = require('express');
const router = Router();
const {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  getMyBlogs,
} = require('../../controllers/blogs/blog.controllers.js');

const { upload } = require('../../middlewares/multer.middlewares.js');
const {
  addBlogValidator,
  updateBlogValidator,
} = require('../../validators/blog.validators.js');
const {
  mongoIdPathVariableValidator,
} = require('../../validators/mongodb.validators.js');
const { validate } = require('../../validators/validate.js');
const { verifyJWT } = require('../../middlewares/auth.middlewares.js');

// secure routes
router.use(verifyJWT);

router
  .route('/')
  .get(getAllBlogs)
  .post(upload.single('blogImage'), addBlogValidator(), validate, createBlog);
router.route('/self/blogs').get(getMyBlogs);
router.route('/');

router
  .route('/:blogId')
  .get(mongoIdPathVariableValidator('blogId'), validate, getBlogById)
  .patch(
    upload.single('blogImage'),
    mongoIdPathVariableValidator('blogId'),
    updateBlogValidator(),
    validate,
    updateBlog
  )
  .delete(mongoIdPathVariableValidator('blogId'), validate, deleteBlog);

module.exports = router;
