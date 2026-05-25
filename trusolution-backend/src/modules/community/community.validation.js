const Joi = require("joi");

const reactionSchema = Joi.string().valid("SUPPORT", "RELATE", "HUG");

module.exports = {
  listPosts: {
    query: Joi.object({
      page: Joi.number().integer().min(1).optional(),
      limit: Joi.number().integer().min(1).max(50).optional(),
    }),
  },
  createPost: {
    body: Joi.object({
      title: Joi.string().trim().min(1).max(80).required(),
      body: Joi.string().trim().min(1).max(5000).required(),
      topics: Joi.array().items(Joi.string().trim().min(1).max(32)).max(10).default([]),
      isAnonymous: Joi.boolean().optional(),
    }),
  },
  likePost: {
    params: Joi.object({
      postId: Joi.string().trim().required(),
    }),
    body: Joi.object({
      liked: Joi.boolean().required(),
    }),
  },
  reactPost: {
    params: Joi.object({
      postId: Joi.string().trim().required(),
    }),
    body: Joi.object({
      reaction: reactionSchema.allow(null).optional(),
    }),
  },
  addComment: {
    params: Joi.object({
      postId: Joi.string().trim().required(),
    }),
    body: Joi.object({
      body: Joi.string().trim().min(1).max(2000).required(),
    }),
  },
};

