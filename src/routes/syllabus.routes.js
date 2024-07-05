const { Router } = require('express');
const router = Router();
const {
  getSyllabusByCourseId,
  getSyllabusById,
  createSyllabus,
  updateSyllabusById,
  deleteSyllabusById,
} = require('../controllers/syllabus.controllers');
const {
  createSyllabusValidator,
  updateSyllabusValidator,
} = require('../validators/syllabus.validators.js');
const { validate } = require('../models/syllabus.models');
const {
  verifyJWT,
  verifyPermission,
} = require('../middlewares/auth.middlewares.js');
const {
  mongoIdPathVariableValidator,
} = require('../validators/mongodb.validators.js');
const { UserRolesEnum } = require('../constants.js');

// secure routes
router.use(verifyJWT);

router
  .route('/:courseId')
  .get(mongoIdPathVariableValidator('courseId'), getSyllabusByCourseId)
  .post(
    verifyPermission([UserRolesEnum.ADMIN]),
    mongoIdPathVariableValidator('courseId'),
    createSyllabusValidator(),
    validate,
    createSyllabus
  );

router
  .route('/:syllabusId')
  .get(mongoIdPathVariableValidator('syllabusId'), getSyllabusById)
  .patch(
    verifyPermission([UserRolesEnum.ADMIN]),
    mongoIdPathVariableValidator('syllabusId'),
    updateSyllabusValidator(),
    validate,
    updateSyllabusById
  )
  .delete(
    verifyPermission([UserRolesEnum.ADMIN]),
    mongoIdPathVariableValidator('syllabusId'),
    deleteSyllabusById
  );

module.exports = router;
