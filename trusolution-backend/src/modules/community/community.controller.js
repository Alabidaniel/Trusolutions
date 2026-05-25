const { successResponse } = require("../../utils/response");
const communityService = require("./community.service");

async function listPosts(req, res, next) {
  try {
    const result = await communityService.listPosts({
      userId: req.user.id,
      query: req.query,
    });
    return successResponse(res, 200, "OK", result);
  } catch (err) {
    return next(err);
  }
}

async function createPost(req, res, next) {
  try {
    const post = await communityService.createPost({
      userId: req.user.id,
      data: req.body,
    });
    return successResponse(res, 201, "Post created", post);
  } catch (err) {
    return next(err);
  }
}

async function likePost(req, res, next) {
  try {
    const result = await communityService.likePost({
      userId: req.user.id,
      postId: req.params.postId,
      liked: req.body.liked,
    });
    return successResponse(res, 200, "OK", result);
  } catch (err) {
    return next(err);
  }
}

async function reactPost(req, res, next) {
  try {
    const result = await communityService.reactPost({
      userId: req.user.id,
      postId: req.params.postId,
      reaction: req.body.reaction,
    });
    return successResponse(res, 200, "OK", result);
  } catch (err) {
    return next(err);
  }
}

async function addComment(req, res, next) {
  try {
    const comment = await communityService.addComment({
      userId: req.user.id,
      postId: req.params.postId,
      body: req.body.body,
    });
    return successResponse(res, 201, "Comment added", comment);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  listPosts,
  createPost,
  likePost,
  reactPost,
  addComment,
};

