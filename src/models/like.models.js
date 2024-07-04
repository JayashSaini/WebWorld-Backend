const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema(
  {
    syllabusId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Syllabus',
      required: true,
    },
    likeBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Like', likeSchema);
