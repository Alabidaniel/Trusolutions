const { successResponse } = require("../../utils/response");
const chatService = require("./chat.service");

async function listMessages(req, res, next) {
  try {
    const result = await chatService.listMessages({
      userId: req.user.id,
      chatId: req.params.chatId,
      query: req.query,
    });
    return successResponse(res, 200, "OK", result);
  } catch (err) {
    return next(err);
  }
}

async function createMessage(req, res, next) {
  try {
    const message = await chatService.createMessage({
      userId: req.user.id,
      chatId: req.params.chatId,
      body: req.body.body,
    });
    return successResponse(res, 201, "Message sent", message);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  listMessages,
  createMessage,
};

