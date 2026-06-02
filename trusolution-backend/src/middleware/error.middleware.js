const { errorResponse } = require("../utils/response");

function notFoundHandler(req, res) {
  return errorResponse(res, 404, "Route not found");
}

function mapPrismaError(err) {
  // Map Prisma errors to appropriate HTTP status codes
  if (err.code === "P2002") {
    // Unique constraint violation
    return {
      statusCode: 409,
      message: "This resource already exists or violates a unique constraint",
    };
  }
  if (err.code === "P2003") {
    // Foreign key constraint violation
    return {
      statusCode: 400,
      message: "Referenced resource not found or invalid relationship",
    };
  }
  if (err.code === "P2025") {
    // Record not found
    return { statusCode: 404, message: "Resource not found" };
  }
  if (err.code === "P2014") {
    // Required relation violation
    return {
      statusCode: 400,
      message: "Invalid operation: related records are required",
    };
  }
  if (err.code?.startsWith("P2")) {
    // Generic Prisma error
    return { statusCode: 400, message: "Database operation failed" };
  }
  return null;
}

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  // Check if this is a Prisma error and map it
  let statusCode = Number(err.statusCode || err.status || 500);
  let message = err.message || "Request failed";

  const prismaMapping = mapPrismaError(err);
  if (prismaMapping) {
    statusCode = prismaMapping.statusCode;
    message = prismaMapping.message;
  }

  // Fallback for unmapped 500+ errors
  if (statusCode >= 500) {
    message = "Internal server error";
  }

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
