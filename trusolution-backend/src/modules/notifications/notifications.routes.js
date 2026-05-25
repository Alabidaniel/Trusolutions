const express = require("express");

const { verifyFirebaseToken, requireUser } = require("../../middleware/auth.middleware");
const validate = require("../../middleware/validate.middleware");
const notificationsController = require("./notifications.controller");
const notificationsValidation = require("./notifications.validation");

const router = express.Router();

router.use(verifyFirebaseToken, requireUser);

router.get(
  "/",
  validate(notificationsValidation.list),
  notificationsController.list,
);

router.patch(
  "/:id/read",
  validate(notificationsValidation.readOne),
  notificationsController.readOne,
);

router.patch(
  "/read-all",
  validate(notificationsValidation.readAll),
  notificationsController.readAll,
);

module.exports = router;

