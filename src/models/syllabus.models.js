const { Schema, Model } = require('mongoose');

const syllabusSchema = new Schema(
  {},
  {
    timestamps: true,
  }
);

module.exports = Model('Syllabus', syllabusSchema);
