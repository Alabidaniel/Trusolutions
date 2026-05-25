const Joi = require("joi");

module.exports = {
  listMessages: {
    params: Joi.object({
      chatId: Joi.string().trim().required(),
    }),
    query: Joi.object({
      limit: Joi.number().integer().min(1).max(50).optional(),
      cursor: Joi.string().trim().optional(),
      order: Joi.string().valid("asc", "desc").optional(),
    }),
  },
  createMessage: {
    params: Joi.object({
      chatId: Joi.string().trim().required(),
    }),
    body: Joi.object({
      body: Joi.string().trim().min(1).max(5000).required(),
    }),
  },
};

