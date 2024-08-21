const { Router } = require('express');
const router = Router();
const {
  addComment,
  deleteComment,
  getVideoComments,
  updateComment,
} = require('../../controllers/courses/comment.controllers.js');
const { verifyJWT } = require('../../middlewares/auth.middlewares.js');
const {
  mongoIdPathVariableValidator,
} = require('../../validators/mongodb.validators.js');
const { validate } = require('../../validators/validate.js');
const { commentValidator } = require('../../validators/course.validators.js');

router.use(verifyJWT);

router
  .route('/:videoId')
  .post(
    commentValidator(),
    mongoIdPathVariableValidator('videoId'),
    validate,
    addComment
  )
  .get(mongoIdPathVariableValidator('videoId'), validate, getVideoComments);
router
  .route('/:commentId')
  .delete(mongoIdPathVariableValidator('commentId'), validate, deleteComment)
  .patch(
    commentValidator(),
    mongoIdPathVariableValidator('commentId'),
    validate,
    updateComment
  );

module.exports = router;
