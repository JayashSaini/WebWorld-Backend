const { body } = require('express-validator');

const createSyllabusValidator = () => {
  return [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('subHeading').trim().notEmpty().withMessage('Subheading is required'),
    body('videoUrl').trim().notEmpty().withMessage('Video URL is required'),
    body('videoTitle').trim().notEmpty().withMessage('Video title is required'),
  ];
};

const updateSyllabusValidator = () => {
  return [
    body('title').optional().trim().notEmpty().withMessage('Title is required'),
    body('subHeading')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Subheading is required'),
    body('videoUrl')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Video URL is required'),
    body('videoTitle')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Video title is required'),
  ];
};

module.exports = {
  createSyllabusValidator,
  updateSyllabusValidator,
};
