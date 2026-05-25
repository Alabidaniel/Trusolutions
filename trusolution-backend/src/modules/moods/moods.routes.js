const express = require("express");

const { verifyFirebaseToken, requireUser } = require("../../middleware/auth.middleware");
const validate = require("../../middleware/validate.middleware");
const moodsController = require("./moods.controller");
const moodsValidation = require("./moods.validation");

const router = express.Router();

router.use(verifyFirebaseToken, requireUser);

router.post(
  "/entries",
  validate(moodsValidation.createEntry),
  moodsController.createEntry,
);

router.get(
  "/entries",
  validate(moodsValidation.listEntries),
  moodsController.listEntries,
);

router.get(
  "/summary",
  validate(moodsValidation.summary),
  moodsController.summary,
);

router.get(
  "/weekly",
  validate(moodsValidation.weekly),
  moodsController.weekly,
);

module.exports = router;

