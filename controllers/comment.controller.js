const { sendResponse, AppError, catchAsync } = require("../helpers/utils");
const Post = require("../models/Post");
const Comment = require("../models/Comment");

const commentController = {};

const calculateCommentCount = async (postId) => {
  const commentCount = await Comment.countDocuments({
    post: postId,
    isDeleted: false,
  });
  await Post.findByIdAndUpdate(postId, { commentCount });
};

commentController.createNewComment = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const { content, postId } = req.body;

  // Check post exists
  const post = await Post.findById(postId);
  if (!post)
    throw new AppError(400, "Post Not Found", "Create New Comment Error");

  // Create new comment
  let comment = await Comment.create({
    author: currentUserId,
    post: postId,
    content,
  });

  // Update CommentCount of the post
  await calculateCommentCount(postId);
  comment = await comment.populate("author");

  return sendResponse(
    res,
    200,
    true,
    comment,
    null,
    "Create New Comment Successfully"
  );
});

commentController.updateSingleComment = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const commentId = req.params.id;
  const { content } = req.body;

  const comment = await Comment.findOneAndUpdate(
    {
      _id: commentId,
      author: currentUserId,
    },
    { content },
    { new: true }
  );

  if (!comment)
    throw new AppError(
      400,
      "Comment Not Found Or User Not Authorized",
      "Update Comment Error"
    );

  return sendResponse(res, 200, true, comment, null, "Update Successfully");
});

commentController.deleteSingleComment = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const commentId = req.params.id;

  const comment = await Comment.findOneAndDelete({
    _id: commentId,
    author: currentUserId,
  });

  if (!comment)
    throw new AppError(
      400,
      "Comment Not Found Or User Not Authorized",
      "Delete Comment Error"
    );

  await calculateCommentCount(comment.post);

  return sendResponse(res, 200, true, comment, null, "Delete Successfully");
});

commentController.getSingleComment = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const commentId = req.params.id;

  let comment = await Comment.findById(commentId);
  if (!comment)
    throw new AppError(400, "Comment Not Found", "Get Single Comment Error");

  return sendResponse(
    res,
    200,
    true,
    comment,
    null,
    "Get Comment Successfully"
  );
});

module.exports = commentController;
