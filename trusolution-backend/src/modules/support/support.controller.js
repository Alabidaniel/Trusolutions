const { successResponse } = require("../../utils/response");
const supportService = require("./support.service");

async function createTicket(req, res, next) {
  try {
    const ticket = await supportService.createTicket({
      userId: req.user.id,
      data: req.body,
    });
    return successResponse(res, 201, "Ticket created", ticket);
  } catch (err) {
    return next(err);
  }
}

async function listTickets(req, res, next) {
  try {
    const result = await supportService.listTickets({
      userId: req.user.id,
      query: req.query,
    });
    return successResponse(res, 200, "OK", result);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  createTicket,
  listTickets,
};

