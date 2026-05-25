const { successResponse } = require("../../utils/response");
const appointmentsService = require("./appointments.service");

async function create(req, res, next) {
  try {
    const appointment = await appointmentsService.create({
      userId: req.user.id,
      data: req.body,
    });
    return successResponse(res, 201, "Appointment created", appointment);
  } catch (err) {
    return next(err);
  }
}

async function upcoming(req, res, next) {
  try {
    const appointment = await appointmentsService.upcoming({ userId: req.user.id });
    return successResponse(res, 200, "OK", appointment);
  } catch (err) {
    return next(err);
  }
}

async function getById(req, res, next) {
  try {
    const appointment = await appointmentsService.getById({
      userId: req.user.id,
      id: req.params.id,
    });
    return successResponse(res, 200, "OK", appointment);
  } catch (err) {
    return next(err);
  }
}

async function reschedule(req, res, next) {
  try {
    const appointment = await appointmentsService.reschedule({
      userId: req.user.id,
      id: req.params.id,
      data: req.body,
    });
    return successResponse(res, 200, "Rescheduled", appointment);
  } catch (err) {
    return next(err);
  }
}

async function cancel(req, res, next) {
  try {
    const appointment = await appointmentsService.cancel({
      userId: req.user.id,
      id: req.params.id,
    });
    return successResponse(res, 200, "Canceled", appointment);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  create,
  upcoming,
  getById,
  reschedule,
  cancel,
};

