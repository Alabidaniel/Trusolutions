const Joi = require("joi");

module.exports = {
  createMatchRequest: {
    body: Joi.object({
      conversationStyle: Joi.string().valid("LISTENER", "ADVICE", "BOTH").default("BOTH"),
      topics: Joi.array().items(Joi.string().trim().min(1).max(32)).min(1).max(20).required(),
    }),
  },
  getMatchRequest: {
    params: Joi.object({
      id: Joi.string().trim().required(),
    }),
  },
  cancelMatchRequest: {
    params: Joi.object({
      id: Joi.string().trim().required(),
    }),
  },
  rateSession: {
    params: Joi.object({
      sessionId: Joi.string().trim().required(),
    }),
    body: Joi.object({
      rating: Joi.number().integer().min(1).max(5).required(),
      feedback: Joi.string().trim().max(2000).optional(),
    }),
  },
};

