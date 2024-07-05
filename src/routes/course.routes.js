const { Router } = require('express');
const router = Router();
const {
  verifyJWT,
  verifyPermission,
} = require('../middlewares/auth.middlewares.js');
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
const { UserRolesEnum } = require('../constants.js');

//  unsecured routes
router.route('/').get(getAllCourses);

// secured routes
router
  .route('/')
  .post(
    verifyJWT,
    upload.single('thumbnail'),
    createCourseValidator(),
    validate,
    createCourse
  );

router
  .route('/:courseId')
  .get(verifyJWT, mongoIdPathVariableValidator('courseId'), getCourseById)
  .delete(
    verifyJWT,
    verifyPermission([UserRolesEnum.ADMIN]),
    mongoIdPathVariableValidator('courseId'),
    deleteCourse
  )
  .patch(
    verifyJWT,
    upload.single('thumbnail'),
    updateCourseValidator(),
    validate,
    mongoIdPathVariableValidator('courseId'),
    updateCourse
  );

module.exports = router;
