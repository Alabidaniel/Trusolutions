const express = require("express");

const { verifyFirebaseToken, requireUser } = require("../../middleware/auth.middleware");
const validate = require("../../middleware/validate.middleware");
const supportController = require("./support.controller");
const supportValidation = require("./support.validation");

const router = express.Router();

router.use(verifyFirebaseToken, requireUser);

router.post(
  "/tickets",
  validate(supportValidation.createTicket),
  supportController.createTicket,
);

router.get(
  "/tickets",
  validate(supportValidation.listTickets),
  supportController.listTickets,
);

module.exports = router;

