const express = require("express");

const { verifyFirebaseToken, requireUser } = require("../../middleware/auth.middleware");
const validate = require("../../middleware/validate.middleware");
const issuesController = require("./issues.controller");
const issuesValidation = require("./issues.validation");

const router = express.Router();

router.use(verifyFirebaseToken, requireUser);

router.get(
  "/",
  validate(issuesValidation.list),
  issuesController.list,
);

module.exports = router;

