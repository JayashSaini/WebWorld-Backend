const mongoose = require('mongoose');
const Comment = require('../../models/courses/comment.models.js');
const { ApiError } = require('../../utils/ApiError.js');
const { ApiResponse } = require('../../utils/ApiResponse.js');
const { asyncHandler } = require('../../utils/asyncHandler.js');

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(400, 'videoID is missing');
  }

  const commentAggregate = await Comment.aggregate([
    {
      $match: {
        syllabusId: new mongoose.Types.ObjectId(videoId),
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'commentBy',
        foreignField: '_id',
        as: 'owner',
        pipeline: [
          {
            $project: {
              username: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        owner: {
          $arrayElemAt: ['$owner', 0],
        },
      },
    },
  ]);

  // const comments = await Comment.aggregatePaginate(commentAggregate, options);

  if (!commentAggregate) {
    throw new ApiError(400, 'videoID is missing');
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, commentAggregate, 'Comment fetched successfully')
    );
});

const addComment = asyncHandler(async (req, res) => {
  // Log to confirm the function is running
  console.log('Add Comment API is running');

  const { comment } = req.body;
  const { videoId } = req.params;

  // Check if both comment and videoId are provided
  if (!comment || !videoId) {
    throw new ApiError(400, 'Both comment and videoId are required');
  }

  // Create a new comment in the database
  const addedComment = await Comment.create({
    comment: comment,
    commentBy: req.user._id,
    syllabusId: videoId,
  });

  // Return a success response with the newly added comment
  return res
    .status(200)
    .json(new ApiResponse(200, addedComment, 'Comment added successfully'));
});

const updateComment = asyncHandler(async (req, res) => {
  let { comment } = req.body;
  const { commentId } = req.params;

  if (!commentId) {
    throw new ApiResponse(400, 'comment Id is required!!!');
  }

  try {
    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      {
        $set: {
          comment: comment,
        },
      },
      {
        new: true,
      }
    );

    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedComment, 'Comment update successfully')
      );
  } catch (error) {
    throw new ApiError(
      500,
      error.message || 'Something went wrong while updating the comment'
    );
  }
});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment
  const { commentId } = req.params;

  if (!commentId) {
    throw new ApiError(400, 'Comment id is missing');
  }
  try {
    const deletedComment = await Comment.findOneAndDelete({
      _id: commentId,
      commentBy: req.user?._id,
    });
    if (!deletedComment) {
      throw new ApiError(403, 'Unauthorized to delete this comment');
    }
    return res
      .status(200)
      .json(
        new ApiResponse(200, deletedComment, 'Comment deleted successfully')
      );
  } catch (error) {
    throw new ApiError(500, error.message || 'While deleting the comment');
  }
});

module.exports = { getVideoComments, addComment, updateComment, deleteComment };
