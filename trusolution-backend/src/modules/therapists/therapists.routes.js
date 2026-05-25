const express = require("express");

const { verifyFirebaseToken, requireUser } = require("../../middleware/auth.middleware");
const validate = require("../../middleware/validate.middleware");
const therapistsController = require("./therapists.controller");
const therapistsValidation = require("./therapists.validation");

const router = express.Router();

router.use(verifyFirebaseToken, requireUser);

router.get(
  "/",
  validate(therapistsValidation.list),
  therapistsController.list,
);

router.get(
  "/:id",
  validate(therapistsValidation.getById),
  therapistsController.getById,
);

router.get(
  "/:id/slots",
  validate(therapistsValidation.listSlots),
  therapistsController.listSlots,
);

module.exports = router;

