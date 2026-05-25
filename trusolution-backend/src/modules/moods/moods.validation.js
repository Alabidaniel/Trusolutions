const Joi = require("joi");

module.exports = {
  createEntry: {
    body: Joi.object({
      mood: Joi.string().valid("CALM", "OKAY", "LOW", "SAD", "ANXIOUS", "ANGRY").required(),
      severity: Joi.number().integer().min(0).max(4).required(),
    }),
  },
  listEntries: {
    query: Joi.object({
      page: Joi.number().integer().min(1).optional(),
      limit: Joi.number().integer().min(1).max(50).optional(),
    }),
  },
  summary: {},
  weekly: {},
};

