const Joi = require("joi");

module.exports = {
  createTicket: {
    body: Joi.object({
      subject: Joi.string().trim().max(200).optional(),
      message: Joi.string().trim().min(1).max(5000).required(),
      priority: Joi.string().valid("LOW", "MEDIUM", "HIGH", "URGENT").optional(),
    }),
  },
  listTickets: {
    query: Joi.object({
      status: Joi.string()
        .valid("OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED")
        .optional(),
      page: Joi.number().integer().min(1).optional(),
      limit: Joi.number().integer().min(1).max(50).optional(),
    }),
  },
};

