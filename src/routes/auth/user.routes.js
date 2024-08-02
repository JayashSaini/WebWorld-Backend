const { Router } = require('express');
const router = Router();
const {
  userRegister,
  userLogin,
  verifyEmail,
  refreshAccessToken,
  forgotPasswordRequest,
  resetForgottenPassword,
  userLogout,
  verifyOtp,
  resendEmailVerification,
  userSelf,
  handleSocialLogin,
  updateAvatar,
  addCourseToFavorites,
  addCourseToEnrollments,
  getFavoritesCourse,
  getEnrollCourse,
} = require('../../controllers/auth/user.controllers.js');
const {
  userRegisterValidator,
  userLoginValidator,
  userForgotPasswordValidator,
  userResetForgottenPasswordValidator,
  userVerifyOtpValidator,
} = require('../../validators/auth/user.validators.js');
const { validate } = require('../../validators/validate.js');
const { verifyJWT } = require('../../middlewares/auth.middlewares.js');
const {
  mongoIdPathVariableValidator,
} = require('../../validators/mongodb.validators.js');
const { upload } = require('../../middlewares/multer.middlewares.js');
require('../../config/passport.config.js'); // import the passport config
const passport = require('passport');

//unsecured routes
router.route('/register').post(userRegisterValidator(), validate, userRegister);
router.route('/login').post(userLoginValidator(), validate, userLogin);
router.route('/refresh-token').post(refreshAccessToken);
router.route('/verify-email/:verificationToken').get(verifyEmail);
router.route('/resend-verify-email').post(resendEmailVerification);

router
  .route('/forgot-password')
  .post(userForgotPasswordValidator(), validate, forgotPasswordRequest);

router.route('/verify-otp').post(userVerifyOtpValidator(), validate, verifyOtp);

router
  .route('/reset-password/:resetToken')
  .post(
    userResetForgottenPasswordValidator(),
    validate,
    resetForgottenPassword
  );

// Secured Routes
router.route('/logout').get(verifyJWT, userLogout);
router.route('/self').get(verifyJWT, userSelf);
router.route('/update-avatar').patch(
  verifyJWT,
  upload.single('avatar'), // multer
  updateAvatar
);

router.route('/favorites').get(verifyJWT, getFavoritesCourse);
router.route('/enrollment').get(verifyJWT, getEnrollCourse);

router
  .route('/favorites/:courseId')
  .post(
    verifyJWT,
    mongoIdPathVariableValidator('courseId'),
    validate,
    addCourseToFavorites
  );

router
  .route('/enrollment/:courseId')
  .post(
    verifyJWT,
    mongoIdPathVariableValidator('courseId'),
    validate,
    addCourseToEnrollments
  );

//SSO Routes
router.route('/google').get(
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  }),
  (req, res) => {
    console.log('redirecting to google...');
    res.send('redirecting to google...');
  }
);

router
  .route('/google/callback')
  .get(passport.authenticate('google'), handleSocialLogin);

module.exports = router;
