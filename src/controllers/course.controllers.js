const { ApiError } = require('../utils/ApiError.js');
const { ApiResponse } = require('../utils/ApiResponse.js');
const { asyncHandler } = require('../utils/asyncHandler.js');
const Course = require('../models/course.models.js');
const { uploadOnCloudinary } = require('../utils/cloudinary.js');
const Syllabus = require('../models/syllabus.models.js');

const getAllCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({});
  return res
    .status(200)
    .json(new ApiResponse(200, courses, 'Courses fetched successfully'));
});

const getCourseById = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.courseId);

  if (!course) {
    throw new ApiError(404, 'Course not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, course, 'Course fetched successfully'));
});

const createCourse = asyncHandler(async (req, res) => {
  const { title, subTitle, about } = req.body;
  const thumbnailLocalPath = req.file?.path;

  if (!thumbnailLocalPath) {
    throw new ApiError(400, 'Thumbnail file is missing');
  }

  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  const course = await Course.create({
    thumbnail: {
      url: thumbnail?.url,
      public_id: String(thumbnail?.public_id),
    },
    title,
    subTitle,
    about,
  });

  if (!course) {
    throw new ApiError(400, 'Failed to create course');
  }

  return res
    .status(201)
    .json(new ApiResponse(201, course, 'Course created successfully'));
});

const updateCourse = asyncHandler(async (req, res) => {
  const { title, subTitle, about } = req.body;
  const thumbnailLocalPath = req.file?.path;
  let thumbnail = {};

  if (thumbnailLocalPath) {
    const uploadedThumbnail = await uploadThumbnail(thumbnailLocalPath);
    thumbnail = {
      url: uploadedThumbnail?.url,
      public_id: String(uploadedThumbnail?.public_id),
    };
  }

  const course = await Course.findByIdAndUpdate(
    req.params.courseId,
    {
      $set: {
        thumbnail,
        title,
        subTitle,
        about,
      },
    },
    { new: true }
  ).select('-updatedAt');

  if (!course) {
    throw new ApiError(404, 'Course not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, course, 'Course details updated successfully'));
});

const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findByIdAndDelete(req.params.courseId);

  if (!course) {
    throw new ApiError(404, 'Course not found');
  }

  // Remove Syllabus data related deleted course
  Syllabus.deleteMany({
    courseId: req.params.courseId,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Course deleted successfully'));
});

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
};
