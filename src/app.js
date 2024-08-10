const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const session = require('express-session');
const passport = require('passport');
const { ApiError } = require('./utils/ApiError.js');
const { errorHandler } = require('./middlewares/error.middlewares.js');
const morganMiddleware = require('./logger/morgan.logger.js');

const app = express();

const startApp = () => {
  // import routes
  const userRouter = require('./routes/auth/user.routes.js');
  const courseRouter = require('./routes/courses/course.routes.js');
  const syllabusRouter = require('./routes/courses/syllabus.routes.js');
  const likeRouter = require('./routes/courses/like.routes.js');
  const commentRouter = require('./routes/courses/comment.routes.js');
  const blogRouter = require('./routes/blogs/blog.routes.js');
  const blogLikeRouter = require('./routes/blogs/like.routes.js');

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN || '*',
      credentials: true,
    })
  );

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));
  app.use(cookieParser());

  // required for passport
  app.use(
    session({
      secret: process.env.EXPRESS_SESSION_SECRET,
      resave: true,
      saveUninitialized: true,
    })
  );

  // session secret
  app.use(passport.initialize());
  app.use(passport.session());

  // Set security headers with Helmet middleware
  app.use(helmet());

  // Log requests with Morgan middleware (use 'combined' format for production)
  app.use(morgan('dev'));
  app.use(morganMiddleware);

  // routes
  app.use('/api/v1/users', userRouter);
  app.use('/api/v1/courses', courseRouter);
  app.use('/api/v1/c/syllabus', syllabusRouter);
  app.use('/api/v1/c/likes', likeRouter);
  app.use('/api/v1/c/comments', commentRouter);
  app.use('/api/v1/blogs', blogRouter);
  app.use('/api/v1/b/likes', blogLikeRouter);

  // if endpoint not found
  app.use((_, __, next) => {
    const error = new ApiError(404, 'endpoint not found');
    next(error);
  });

  // Error handler
  app.use(errorHandler);
};

module.exports = { app, startApp };
