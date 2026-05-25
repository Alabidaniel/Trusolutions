const { successResponse } = require("../../utils/response");
const usersService = require("./users.service");

async function updateMe(req, res, next) {
  try {
    const user = await usersService.updateMe({
      userId: req.user.id,
      data: req.body,
    });
    return successResponse(res, 200, "Profile updated", user);
  } catch (err) {
    return next(err);
  }
}

async function getPreferences(req, res, next) {
  try {
    const prefs = await usersService.getPreferences({ userId: req.user.id });
    return successResponse(res, 200, "OK", prefs);
  } catch (err) {
    return next(err);
  }
}

async function updatePreferences(req, res, next) {
  try {
    const prefs = await usersService.updatePreferences({
      userId: req.user.id,
      data: req.body,
    });
    return successResponse(res, 200, "Preferences updated", prefs);
  } catch (err) {
    return next(err);
  }
}

async function replaceIssues(req, res, next) {
  try {
    const result = await usersService.replaceIssues({
      userId: req.user.id,
      issueIds: req.body.issueIds,
    });
    return successResponse(res, 200, "Issues updated", result);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  updateMe,
  getPreferences,
  updatePreferences,
  replaceIssues,
};

