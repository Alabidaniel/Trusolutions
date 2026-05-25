const Joi = require("joi");

module.exports = {
  list: {
    query: Joi.object({
      unreadOnly: Joi.boolean().truthy("true").falsy("false").optional(),
      page: Joi.number().integer().min(1).optional(),
      limit: Joi.number().integer().min(1).max(50).optional(),
    }),
  },
  readOne: {
    params: Joi.object({
      id: Joi.string().trim().required(),
    }),
  },
  readAll: {},
};

