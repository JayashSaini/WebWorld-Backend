const { body } = require('express-validator');

const createCourseValidator = () => {
  return [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('subTitle').trim().notEmpty().withMessage('Sub Title is required'),
    body('about').trim().notEmpty().withMessage('about is required'),
  ];
};

const updateCourseValidator = () => {
  return [
    body('title').optional().trim().notEmpty().withMessage('Title is required'),
    body('subTitle')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Sub Title is required'),
    body('about').optional().trim().notEmpty().withMessage('about is required'),
  ];
};

module.exports = {
  createCourseValidator,
  updateCourseValidator,
};
