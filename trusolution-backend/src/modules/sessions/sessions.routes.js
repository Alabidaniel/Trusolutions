const express = require("express");

const { verifyFirebaseToken, requireUser } = require("../../middleware/auth.middleware");
const validate = require("../../middleware/validate.middleware");
const sessionsController = require("./sessions.controller");
const sessionsValidation = require("./sessions.validation");

const router = express.Router();

router.use(verifyFirebaseToken, requireUser);

router.post(
  "/peer/match-requests",
  validate(sessionsValidation.createMatchRequest),
  sessionsController.createMatchRequest,
);

router.get(
  "/peer/match-requests/:id",
  validate(sessionsValidation.getMatchRequest),
  sessionsController.getMatchRequest,
);

router.post(
  "/peer/match-requests/:id/cancel",
  validate(sessionsValidation.cancelMatchRequest),
  sessionsController.cancelMatchRequest,
);

router.post(
  "/:sessionId/ratings",
  validate(sessionsValidation.rateSession),
  sessionsController.rateSession,
);

module.exports = router;

