const mongoose = require('mongoose');

const syllabusSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subHeading: {
      type: String,
      required: true,
      trim: true,
    },
    video: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Syllabus', syllabusSchema);
