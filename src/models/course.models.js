const mongoose = require('mongoose');

const courseSchmea = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subTitle: {
      type: String,
      required: true,
      trim: true,
    },
    about: {
      type: String,
      required: true,
      trim: true,
    },
    syllabus: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Syllabus',
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Course', courseSchmea);
