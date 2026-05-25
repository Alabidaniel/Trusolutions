const authService = require("./auth.service");
const { successResponse } = require("../../utils/response");

async function sync(req, res, next) {
  try {
    const user = await authService.syncUser({
      firebase: req.firebase,
    });
    return successResponse(res, 200, "User synced", user);
  } catch (err) {
    return next(err);
  }
}

async function me(req, res, next) {
  try {
    const user = await authService.getMe({ userId: req.user.id });
    return successResponse(res, 200, "OK", user);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  sync,
  me,
};

