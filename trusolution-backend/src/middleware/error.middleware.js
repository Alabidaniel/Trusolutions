const { errorResponse } = require("../utils/response");

function notFoundHandler(req, res) {
  return errorResponse(res, 404, "Route not found");
}

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = Number(err.statusCode || err.status || 500);
  const message =
    statusCode >= 500 ? "Internal server error" : err.message || "Request failed";

  const errors = err.errors || err.details || null;

  if (statusCode >= 500) {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  return errorResponse(res, statusCode, message, errors);
}

module.exports = {
  notFoundHandler,
  errorHandler,
};

