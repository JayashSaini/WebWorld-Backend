const { ApiError } = require('../utils/ApiError.js');
const { ApiResponse } = require('../utils/ApiResponse.js');
const { asyncHandler } = require('../utils/asyncHandler.js');
const Syllabus = require('../models/syllabus.models.js');
const Course = require('../models/course.models.js');

const getSyllabusByCourseId = asyncHandler(async (req, res) => {
  const syllabus = await Syllabus.findOne({ courseId: req.params.courseId });

  if (!syllabus) {
    throw new ApiError(404, 'Syllabus not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, syllabus, 'Syllabus fetched successfully'));
});

const getSyllabusById = asyncHandler(async (req, res) => {
  const syllabus = await Syllabus.find({
    _id: req.params.syllabusId,
    courseId: req.params.courseId,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, syllabus, 'Syllabuses fetched successfully'));
});

const createSyllabus = asyncHandler(async (req, res) => {
  const { title, subHeading, videoUrl, videoTitle } = req.body;

  let course = await Course.findById(req.params?.courseId);

  if (!course) {
    throw new ApiError(400, 'Course not found');
  }

  const syllabus = await Syllabus.create({
    courseId: req.params?.courseId,
    title,
    subHeading,
    video: { url: videoUrl, title: videoTitle },
  });

  if (!syllabus) {
    throw new ApiError(400, 'Failed to create syllabus');
  }

  course.syllabus.push(syllabus._id);
  await course.save();

  return res
    .status(201)
    .json(new ApiResponse(201, syllabus, 'Syllabus created successfully'));
});

const updateSyllabusById = asyncHandler(async (req, res) => {
  const { title, subHeading, videoUrl, videoTitle } = req.body;

  const syllabus = await Syllabus.findByIdAndUpdate(
    req.params.syllabusId,
    {
      title,
      subHeading,
      video: { url: videoUrl, title: videoTitle },
    },
    { new: true }
  );

  if (!syllabus) {
    throw new ApiError(404, 'Syllabus not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, syllabus, 'Syllabus updated successfully'));
});

const deleteSyllabusById = asyncHandler(async (req, res) => {
  const syllabus = await Syllabus.findByIdAndDelete(req.params?.syllabusId);

  const course = await Course.findByIdAndUpdate(
    req.params?.courseId,
    {
      $pull: {
        syllabus: { _id: req.params?.syllabusId },
      },
    },
    { new: true }
  );

  if (!course) {
    throw new ApiError(404, 'Course not found');
  }

  if (!syllabus) {
    throw new ApiError(404, 'Syllabus not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Syllabus deleted successfully'));
});

module.exports = {
  getSyllabusByCourseId,
  getSyllabusById,
  createSyllabus,
  updateSyllabusById,
  deleteSyllabusById,
};
