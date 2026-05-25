const { successResponse } = require("../../utils/response");
const issuesService = require("./issues.service");

async function list(req, res, next) {
  try {
    const issues = await issuesService.listIssues();
    return successResponse(res, 200, "OK", { items: issues });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  list,
};

