const Joi = require("joi");

function formatJoiErrors(details) {
  return details.map((d) => ({
    message: d.message,
    path: d.path,
    type: d.type,
  }));
}

function validate({ body, query, params }) {
  return async (req, res, next) => {
    try {
      if (body) {
        const schema = Joi.isSchema(body) ? body : Joi.object(body);
        req.body = await schema.validateAsync(req.body, {
          abortEarly: false,
          stripUnknown: true,
        });
      }

      if (query) {
        const schema = Joi.isSchema(query) ? query : Joi.object(query);
        req.query = await schema.validateAsync(req.query, {
          abortEarly: false,
          stripUnknown: true,
        });
      }

      if (params) {
        const schema = Joi.isSchema(params) ? params : Joi.object(params);
        req.params = await schema.validateAsync(req.params, {
          abortEarly: false,
          stripUnknown: true,
        });
      }

      return next();
    } catch (err) {
      if (err?.isJoi) {
        const e = new Error("Validation failed");
        e.statusCode = 400;
        e.errors = formatJoiErrors(err.details || []);
        return next(e);
      }

      return next(err);
    }
  };
}

module.exports = validate;

