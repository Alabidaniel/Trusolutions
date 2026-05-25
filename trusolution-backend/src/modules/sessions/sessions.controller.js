const { successResponse } = require("../../utils/response");
const sessionsService = require("./sessions.service");

async function createMatchRequest(req, res, next) {
  try {
    const result = await sessionsService.createMatchRequest({
      userId: req.user.id,
      data: req.body,
    });
    return successResponse(res, 201, "Match request created", result);
  } catch (err) {
    return next(err);
  }
}

async function getMatchRequest(req, res, next) {
  try {
    const result = await sessionsService.getMatchRequest({
      userId: req.user.id,
      id: req.params.id,
    });
    return successResponse(res, 200, "OK", result);
  } catch (err) {
    return next(err);
  }
}

async function cancelMatchRequest(req, res, next) {
  try {
    const result = await sessionsService.cancelMatchRequest({
      userId: req.user.id,
      id: req.params.id,
    });
    return successResponse(res, 200, "Canceled", result);
  } catch (err) {
    return next(err);
  }
}

async function rateSession(req, res, next) {
  try {
    const result = await sessionsService.rateSession({
      userId: req.user.id,
      sessionId: req.params.sessionId,
      data: req.body,
    });
    return successResponse(res, 201, "Rating submitted", result);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  createMatchRequest,
  getMatchRequest,
  cancelMatchRequest,
  rateSession,
};

