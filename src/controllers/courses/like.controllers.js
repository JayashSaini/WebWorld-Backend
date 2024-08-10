const Like = require('../../models/courses/like.models.js');
const { ApiError } = require('../../utils/ApiError.js');
const { ApiResponse } = require('../../utils/ApiResponse.js');
const { asyncHandler } = require('../../utils/asyncHandler.js');

const toggleLike = asyncHandler(async (req, res) => {
  const { syllabusId } = req.params;

  if (!syllabusId) {
    throw new ApiError('Video Id is missing');
  }

  const likedDoc = await Like.findOne({
    likedBy: req.user._id,
    syllabusId: syllabusId,
  });

  if (likedDoc) {
    await Like.findOneAndDelete({
      likedBy: req.user._id,
      syllabusId: syllabusId,
    });
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          likeStatus: false,
        },
        'Un liked successfully'
      )
    );
  }

  await Like.create({
    likedBy: req.user._id,
    syllabusId: syllabusId,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        likeStatus: true,
      },
      'Liked successfully'
    )
  );
});

module.exports = { toggleLike };
