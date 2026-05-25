const Joi = require("joi");

module.exports = {
  list: {
    query: Joi.object({
      q: Joi.string().trim().max(120).optional(),
      specialty: Joi.string().trim().max(120).optional(),
      page: Joi.number().integer().min(1).optional(),
      limit: Joi.number().integer().min(1).max(50).optional(),
    }),
  },
  getById: {
    params: Joi.object({
      id: Joi.string().trim().required(),
    }),
  },
  listSlots: {
    params: Joi.object({
      id: Joi.string().trim().required(),
    }),
    query: Joi.object({
      page: Joi.number().integer().min(1).optional(),
      limit: Joi.number().integer().min(1).max(50).optional(),
    }),
  },
};

