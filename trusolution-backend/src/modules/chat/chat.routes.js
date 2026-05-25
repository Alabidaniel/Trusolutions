const express = require("express");

const { verifyFirebaseToken, requireUser } = require("../../middleware/auth.middleware");
const validate = require("../../middleware/validate.middleware");
const chatController = require("./chat.controller");
const chatValidation = require("./chat.validation");

const router = express.Router();

router.use(verifyFirebaseToken, requireUser);

router.get(
  "/:chatId/messages",
  validate(chatValidation.listMessages),
  chatController.listMessages,
);

router.post(
  "/:chatId/messages",
  validate(chatValidation.createMessage),
  chatController.createMessage,
);

module.exports = router;

