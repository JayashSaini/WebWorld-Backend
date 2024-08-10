const { body } = require('express-validator');

const createCourseValidator = () => {
  return [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('subTitle').trim().notEmpty().withMessage('Subtitle is required'),
    body('about').trim().notEmpty().withMessage('About is required'),
    // You can add more validations specific to each field if needed
  ];
};

const updateCourseValidator = () => {
  return [
    body('title').optional().trim().notEmpty().withMessage('Title is required'),
    body('subTitle')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Subtitle is required'),
    body('about').optional().trim().notEmpty().withMessage('About is required'),
    // You can add more validations specific to each field if needed
  ];
};

const commentValidator = () => {
  return [body('comment').trim().notEmpty().withMessage('Comment is required')];
};

module.exports = {
  createCourseValidator,
  updateCourseValidator,
  commentValidator,
};
