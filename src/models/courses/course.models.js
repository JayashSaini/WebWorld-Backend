const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    thumbnail: {
      type: {
        url: String,
        public_id: String,
      },
      required: true,
    },
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

module.exports = mongoose.model('Course', courseSchema);
