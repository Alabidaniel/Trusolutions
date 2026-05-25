const { successResponse } = require("../../utils/response");
const moodsService = require("./moods.service");

async function createEntry(req, res, next) {
  try {
    const entry = await moodsService.createEntry({
      userId: req.user.id,
      data: req.body,
    });
    return successResponse(res, 201, "Mood saved", entry);
  } catch (err) {
    return next(err);
  }
}

async function listEntries(req, res, next) {
  try {
    const result = await moodsService.listEntries({
      userId: req.user.id,
      query: req.query,
    });
    return successResponse(res, 200, "OK", result);
  } catch (err) {
    return next(err);
  }
}

async function summary(req, res, next) {
  try {
    const result = await moodsService.summary({ userId: req.user.id });
    return successResponse(res, 200, "OK", result);
  } catch (err) {
    return next(err);
  }
}

async function weekly(req, res, next) {
  try {
    const result = await moodsService.weekly({ userId: req.user.id });
    return successResponse(res, 200, "OK", result);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  createEntry,
  listEntries,
  summary,
  weekly,
};

