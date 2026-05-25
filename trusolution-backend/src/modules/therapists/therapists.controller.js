const { successResponse } = require("../../utils/response");
const therapistsService = require("./therapists.service");

async function list(req, res, next) {
  try {
    const result = await therapistsService.list({ query: req.query });
    return successResponse(res, 200, "OK", result);
  } catch (err) {
    return next(err);
  }
}

async function getById(req, res, next) {
  try {
    const therapist = await therapistsService.getById({ id: req.params.id });
    return successResponse(res, 200, "OK", therapist);
  } catch (err) {
    return next(err);
  }
}

async function listSlots(req, res, next) {
  try {
    const result = await therapistsService.listSlots({
      therapistId: req.params.id,
      query: req.query,
    });
    return successResponse(res, 200, "OK", result);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  list,
  getById,
  listSlots,
};

