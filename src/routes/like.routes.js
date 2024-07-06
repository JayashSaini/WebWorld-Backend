const { Router } = require('express');
const router = Router();
const { toggleLike } = require('../controllers/like.controllers.js');
const { verifyJWT } = require('../middlewares/auth.middlewares.js');
const {
  mongoIdPathVariableValidator,
} = require('../validators/mongodb.validators');
const { validate } = require('../validators/validate.js');

router
  .route('/:syllabusId')
  .post(
    verifyJWT,
    mongoIdPathVariableValidator('syllabusId'),
    validate,
    toggleLike
  );

module.exports = router;
