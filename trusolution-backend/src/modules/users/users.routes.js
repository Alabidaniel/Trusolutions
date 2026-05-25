const express = require("express");

const { verifyFirebaseToken, requireUser } = require("../../middleware/auth.middleware");
const validate = require("../../middleware/validate.middleware");
const usersController = require("./users.controller");
const usersValidation = require("./users.validation");

const router = express.Router();

router.use(verifyFirebaseToken, requireUser);

router.patch(
  "/me",
  validate(usersValidation.updateMe),
  usersController.updateMe,
);

router.get(
  "/me/preferences",
  validate(usersValidation.getPreferences),
  usersController.getPreferences,
);

router.patch(
  "/me/preferences",
  validate(usersValidation.updatePreferences),
  usersController.updatePreferences,
);

router.put(
  "/me/issues",
  validate(usersValidation.replaceIssues),
  usersController.replaceIssues,
);

module.exports = router;

