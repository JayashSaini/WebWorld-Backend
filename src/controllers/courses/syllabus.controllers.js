const { ApiError } = require('../../utils/ApiError.js');
const { ApiResponse } = require('../../utils/ApiResponse.js');
const { asyncHandler } = require('../../utils/asyncHandler.js');
const Syllabus = require('../../models/courses/syllabus.models.js');
const Course = require('../../models/courses/course.models.js');
const { default: mongoose } = require('mongoose');

const getSyllabusByCourseId = asyncHandler(async (req, res) => {
  const syllabus = await Syllabus.find({ courseId: req.params.courseId });

  if (!syllabus) {
    throw new ApiError(404, 'Syllabus not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, syllabus, 'Syllabus fetched successfully'));
});

const getSyllabusById = asyncHandler(async (req, res) => {
  const { syllabusId, courseId } = req.params;
  const userId = req.user._id; // Assuming you have user info available in req.user

  const syllabus = await Syllabus.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(syllabusId),
        courseId: new mongoose.Types.ObjectId(courseId),
      },
    },
    {
      $lookup: {
        from: 'likes', // Adjust this to your actual likes collection name
        let: { syllabusId: '$_id' },
        pipeline: [
          { $match: { $expr: { $eq: ['$syllabusId', '$$syllabusId'] } } },
          { $project: { likedBy: 1 } },
        ],
        as: 'likes',
      },
    },
    {
      $addFields: {
        totalLikes: { $size: '$likes' },
        isUserLiked: {
          $in: [new mongoose.Types.ObjectId(userId), '$likes.likedBy'],
        },
      },
    },
    {
      $project: {
        _id: 1,
        courseId: 1,
        title: 1,
        subHeading: 1,
        video: 1,
        courseId: 1,
        totalLikes: 1,
        isUserLiked: 1,
      },
    },
  ]);

  if (!syllabus.length) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, 'Syllabus not found'));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, syllabus[0], 'Syllabus fetched successfully'));
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

  const syllabus = await Syllabus.findOneAndUpdate(
    {
      _id: req.params.syllabusId,
      courseId: req.params.courseId,
    },
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
  const course = await Course.findById(req.params.courseId);
  if (!course) {
    throw new ApiError(404, 'Course not found');
  }

  const syllabus = await Syllabus.findByIdAndDelete(req.params?.syllabusId);
  if (!syllabus) {
    throw new ApiError(404, 'Syllabus not found');
  }

  course.syllabus.push(syllabus._id);
  await course.save();

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
