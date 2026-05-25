const express = require("express");

const { verifyFirebaseToken, requireUser } = require("../../middleware/auth.middleware");
const validate = require("../../middleware/validate.middleware");
const appointmentsController = require("./appointments.controller");
const appointmentsValidation = require("./appointments.validation");

const router = express.Router();

router.use(verifyFirebaseToken, requireUser);

router.post(
  "/",
  validate(appointmentsValidation.create),
  appointmentsController.create,
);

router.get(
  "/upcoming",
  validate(appointmentsValidation.upcoming),
  appointmentsController.upcoming,
);

router.get(
  "/:id",
  validate(appointmentsValidation.getById),
  appointmentsController.getById,
);

router.patch(
  "/:id/reschedule",
  validate(appointmentsValidation.reschedule),
  appointmentsController.reschedule,
);

router.patch(
  "/:id/cancel",
  validate(appointmentsValidation.cancel),
  appointmentsController.cancel,
);

module.exports = router;

