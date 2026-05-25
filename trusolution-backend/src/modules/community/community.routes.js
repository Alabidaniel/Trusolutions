const express = require("express");

const { verifyFirebaseToken, requireUser } = require("../../middleware/auth.middleware");
const validate = require("../../middleware/validate.middleware");
const communityController = require("./community.controller");
const communityValidation = require("./community.validation");

const router = express.Router();

router.use(verifyFirebaseToken, requireUser);

router.get(
  "/posts",
  validate(communityValidation.listPosts),
  communityController.listPosts,
);

router.post(
  "/posts",
  validate(communityValidation.createPost),
  communityController.createPost,
);

router.put(
  "/posts/:postId/like",
  validate(communityValidation.likePost),
  communityController.likePost,
);

router.put(
  "/posts/:postId/reaction",
  validate(communityValidation.reactPost),
  communityController.reactPost,
);

router.post(
  "/posts/:postId/comments",
  validate(communityValidation.addComment),
  communityController.addComment,
);

module.exports = router;

