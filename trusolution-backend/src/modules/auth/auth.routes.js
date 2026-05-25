const express = require("express");

const { verifyFirebaseToken, requireUser } = require("../../middleware/auth.middleware");
const validate = require("../../middleware/validate.middleware");
const authController = require("./auth.controller");
const authValidation = require("./auth.validation");

const router = express.Router();

router.post(
  "/sync",
  verifyFirebaseToken,
  validate(authValidation.sync),
  authController.sync,
);

router.get(
  "/me",
  verifyFirebaseToken,
  requireUser,
  validate(authValidation.me),
  authController.me,
);

module.exports = router;

