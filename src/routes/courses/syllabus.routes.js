const { Router } = require('express');
const router = Router();
const {
  getSyllabusByCourseId,
  getSyllabusById,
  createSyllabus,
  updateSyllabusById,
  deleteSyllabusById,
} = require('../../controllers/courses/syllabus.controllers.js');
const {
  createSyllabusValidator,
  updateSyllabusValidator,
} = require('../../validators/syllabus.validators.js');
const { validate } = require('../../validators/validate.js');
const {
  verifyJWT,
  verifyPermission,
} = require('../../middlewares/auth.middlewares.js');
const {
  mongoIdPathVariableValidator,
} = require('../../validators/mongodb.validators.js');
const { UserRolesEnum } = require('../../constants.js');

// Secure routes
router.use(verifyJWT);

router
  .route('/:courseId')
  .get(
    mongoIdPathVariableValidator('courseId'),
    validate,
    getSyllabusByCourseId
  )
  .post(
    verifyPermission([UserRolesEnum.ADMIN]),
    mongoIdPathVariableValidator('courseId'),
    createSyllabusValidator(),
    validate,
    createSyllabus
  );

router
  .route('/:courseId/:syllabusId')
  .get(
    mongoIdPathVariableValidator('courseId'),
    mongoIdPathVariableValidator('syllabusId'),
    validate,
    getSyllabusById
  )
  .patch(
    verifyPermission([UserRolesEnum.ADMIN]),
    mongoIdPathVariableValidator('courseId'),
    mongoIdPathVariableValidator('syllabusId'),
    updateSyllabusValidator(),
    validate,
    updateSyllabusById
  )
  .delete(
    verifyPermission([UserRolesEnum.ADMIN]),
    mongoIdPathVariableValidator('courseId'),
    mongoIdPathVariableValidator('syllabusId'),
    validate,
    deleteSyllabusById
  );

module.exports = router;
