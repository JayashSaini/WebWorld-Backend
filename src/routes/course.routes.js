const { Router } = require('express');
const router = Router();
const { verifyJWT } = require('../middlewares/auth.middlewares.js');
const { validate } = require('../validators/validate.js');
const {
  createCourseValidator,
  updateCourseValidator,
} = require('../validators/course.validators.js');
const { upload } = require('../middlewares/multer.middlewares.js');
const {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} = require('../controllers/course.controllers.js');
const {
  mongoIdPathVariableValidator,
} = require('../validators/mongodb.validators.js');

//  unsecured routes
router.route('/').get(getAllCourses);

// secured routes
router.use(verifyJWT);

router
  .route('/')
  .post(
    createCourseValidator(),
    validate,
    upload.single('thumbnail'),
    createCourse
  );

router
  .route('/:courseId')
  .get(mongoIdPathVariableValidator('courseId'), getCourseById)
  .delete(mongoIdPathVariableValidator('courseId'), deleteCourse)
  .patch(
    updateCourseValidator(),
    validate,
    mongoIdPathVariableValidator('courseId'),
    upload.single('thumbnail'),
    updateCourse
  );

module.exports = router;
