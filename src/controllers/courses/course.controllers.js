const { ApiError } = require('../../utils/ApiError.js');
const { ApiResponse } = require('../../utils/ApiResponse.js');
const { asyncHandler } = require('../../utils/asyncHandler.js');
const Course = require('../../models/courses/course.models.js');
const { uploadOnCloudinary } = require('../../utils/cloudinary.js');
const Syllabus = require('../../models/courses/syllabus.models.js');
const mongoose = require('mongoose');

const getAllCourses = asyncHandler(async (req, res) => {
  // Get page and limit from query parameters with default values
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 8;
  const skip = (page - 1) * limit;

  // Aggregate pipeline with pagination
  const courses = await Course.aggregate([{ $skip: skip }, { $limit: limit }]);

  // Count total documents to calculate the total number of pages
  const totalCourses = await Course.countDocuments();
  const totalPages = Math.ceil(totalCourses / limit);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        courses,
        page,
        totalPages,
        totalCourses,
      },
      'Courses fetched successfully'
    )
  );
});

const getCourseById = asyncHandler(async (req, res) => {
  const courseId = req.params.courseId;

  const courseWithLessons = await Course.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(courseId) },
    },
    {
      $lookup: {
        from: 'syllabuses', // the collection name where lessons are stored
        localField: 'syllabus',
        foreignField: '_id',
        as: 'lessonDetails',
      },
    },
    {
      $project: {
        title: 1,
        syllabus: 1,
        lessonTitles: '$lessonDetails.title',
        thumbnail: {
          url: 1,
          public_id: 1,
          _id: 1,
        },
        subTitle: 1,
        about: 1,
        syllabus: 1,
        createdAt: 1,
        updatedAt: 1,
        __v: 1,
      },
    },
  ]);

  if (courseWithLessons.length === 0) {
    throw new ApiError(404, 'Course not found');
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, courseWithLessons[0], 'Course fetched successfully')
    );
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
  let updateFields = {};

  // Conditionally add fields to updateFields
  if (title) updateFields.title = title;
  if (subTitle) updateFields.subTitle = subTitle;
  if (about) updateFields.about = about;

  if (thumbnailLocalPath) {
    const uploadedThumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    updateFields.thumbnail = {
      url: uploadedThumbnail?.url,
      public_id: String(uploadedThumbnail?.public_id),
    };
  }

  // Check if there are any fields to update
  if (Object.keys(updateFields).length === 0) {
    throw new ApiError(400, 'No fields provided to update');
  }

  const course = await Course.findByIdAndUpdate(
    req.params.courseId,
    { $set: updateFields },
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
