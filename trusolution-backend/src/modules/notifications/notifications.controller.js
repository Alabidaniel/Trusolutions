const { successResponse } = require("../../utils/response");
const notificationsService = require("./notifications.service");

async function list(req, res, next) {
  try {
    const result = await notificationsService.list({
      userId: req.user.id,
      query: req.query,
    });
    return successResponse(res, 200, "OK", result);
  } catch (err) {
    return next(err);
  }
}

async function readOne(req, res, next) {
  try {
    const notification = await notificationsService.readOne({
      userId: req.user.id,
      id: req.params.id,
    });
    return successResponse(res, 200, "OK", notification);
  } catch (err) {
    return next(err);
  }
}

async function readAll(req, res, next) {
  try {
    const result = await notificationsService.readAll({ userId: req.user.id });
    return successResponse(res, 200, "OK", result);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  list,
  readOne,
  readAll,
};

