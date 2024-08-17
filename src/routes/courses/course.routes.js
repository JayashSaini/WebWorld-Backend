const { Router } = require('express');
const router = Router();
const {
  verifyJWT,
  verifyPermission,
} = require('../../middlewares/auth.middlewares.js');
const { validate } = require('../../validators/validate.js');
const {
  createCourseValidator,
  updateCourseValidator,
} = require('../../validators/course.validators.js');
const { upload } = require('../../middlewares/multer.middlewares.js');
const {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getCoursesByQuery,
} = require('../../controllers/courses/course.controllers.js');
const {
  mongoIdPathVariableValidator,
} = require('../../validators/mongodb.validators.js');
const { UserRolesEnum } = require('../../constants.js');

// secured routes
router.use(verifyJWT);

router
  .route('/')
  .get(getAllCourses)
  .post(
    upload.single('thumbnail'),
    createCourseValidator(),
    validate,
    createCourse
  );

router.route('/query').get(getCoursesByQuery);

router
  .route('/:courseId')
  .get(mongoIdPathVariableValidator('courseId'), getCourseById)
  .delete(
    verifyPermission([UserRolesEnum.ADMIN]),
    mongoIdPathVariableValidator('courseId'),
    deleteCourse
  )
  .patch(
    upload.single('thumbnail'),
    updateCourseValidator(),
    validate,
    mongoIdPathVariableValidator('courseId'),
    updateCourse
  );

module.exports = router;
