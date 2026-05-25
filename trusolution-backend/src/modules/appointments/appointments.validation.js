const Joi = require("joi");

module.exports = {
  create: {
    body: Joi.object({
      therapistId: Joi.string().trim().required(),
      slotId: Joi.string().trim().optional(),
      appointmentType: Joi.string().valid("CHAT", "CALL", "IN_PERSON").default("CHAT"),
      scheduledStartAt: Joi.date().iso().required(),
      scheduledEndAt: Joi.date().iso().required(),
    }),
  },
  upcoming: {},
  getById: {
    params: Joi.object({
      id: Joi.string().trim().required(),
    }),
  },
  reschedule: {
    params: Joi.object({
      id: Joi.string().trim().required(),
    }),
    body: Joi.object({
      scheduledStartAt: Joi.date().iso().required(),
      scheduledEndAt: Joi.date().iso().required(),
    }),
  },
  cancel: {
    params: Joi.object({
      id: Joi.string().trim().required(),
    }),
  },
};

