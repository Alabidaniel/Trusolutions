const prisma = require("../../config/prisma");

async function buildBookingCode(tx) {
  // Generate unique booking code with retry logic
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const code = `BK-${Math.floor(100000 + Math.random() * 900000).toString()}`;
    const exists = await tx.appointment.findFirst({
      where: { bookingCode: code },
      select: { id: true },
    });
    if (!exists) {
      return code;
    }
  }
  // If we've tried 5 times and still hit collisions, throw error
  const err = new Error("Failed to generate unique booking code");
  err.statusCode = 500;
  throw err;
}

async function create({ userId, data }) {
  return prisma.$transaction(async (tx) => {
    const therapist = await tx.therapist.findFirst({
      where: { id: data.therapistId, deletedAt: null, isActive: true },
      select: { id: true, userId: true },
    });

    if (!therapist) {
      const err = new Error("Therapist not found");
      err.statusCode = 404;
      throw err;
    }

    let scheduledStartAt = data.scheduledStartAt;
    let scheduledEndAt = data.scheduledEndAt;

    let slot = null;
    if (data.slotId) {
      slot = await tx.therapistSlot.findFirst({
        where: {
          id: data.slotId,
          therapistId: therapist.id,
          status: "AVAILABLE",
          deletedAt: null,
        },
      });

      if (!slot) {
        const err = new Error("Slot not available");
        err.statusCode = 400;
        throw err;
      }

      scheduledStartAt = slot.startAt;
      scheduledEndAt = slot.endAt;
    }

    let bookingCode = await buildBookingCode(tx);

    const appointment = await tx.appointment.create({
      data: {
        userId,
        therapistId: therapist.id,
        slotId: slot ? slot.id : null,
        appointmentType: data.appointmentType,
        status: "SCHEDULED",
        scheduledStartAt,
        scheduledEndAt,
        bookingCode,
      },
    });

    if (slot) {
      await tx.therapistSlot.update({
        where: { id: slot.id },
        data: { status: "BOOKED" },
      });
    }

    const participants = [{ userId }];
    if (therapist.userId) {
      participants.push({ userId: therapist.userId });
    }

    const chat = await tx.chat.create({
      data: {
        type: "THERAPIST",
        appointmentId: appointment.id,
        therapistId: therapist.id,
        participants: {
          create: participants,
        },
      },
    });

    return { ...appointment, chatId: chat.id };
  });
}

async function upcoming({ userId }) {
  const appointment = await prisma.appointment.findFirst({
    where: {
      userId,
      deletedAt: null,
      status: { in: ["SCHEDULED", "CONFIRMED"] },
      scheduledStartAt: { gte: new Date() },
    },
    orderBy: { scheduledStartAt: "asc" },
    include: { therapist: true, chat: true },
  });

  return appointment;
}

async function getById({ userId, id }) {
  const appointment = await prisma.appointment.findFirst({
    where: { id, userId, deletedAt: null },
    include: { therapist: true, slot: true, chat: true },
  });

  if (!appointment) {
    const err = new Error("Appointment not found");
    err.statusCode = 404;
    throw err;
  }

  return appointment;
}

async function reschedule({ userId, id, data }) {
  const appointment = await prisma.appointment.findFirst({
    where: { id, userId, deletedAt: null },
  });

  if (!appointment) {
    const err = new Error("Appointment not found");
    err.statusCode = 404;
    throw err;
  }

  if (appointment.status === "CANCELED") {
    const err = new Error("Appointment is canceled");
    err.statusCode = 400;
    throw err;
  }

  const { scheduledStartAt, scheduledEndAt } = data;

  // Validate times
  if (!scheduledStartAt || !scheduledEndAt) {
    const err = new Error("Start and end times are required");
    err.statusCode = 400;
    throw err;
  }

  const startDate = new Date(scheduledStartAt);
  const endDate = new Date(scheduledEndAt);

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    const err = new Error("Invalid date/time format");
    err.statusCode = 400;
    throw err;
  }

  if (endDate <= startDate) {
    const err = new Error("End time must be after start time");
    err.statusCode = 400;
    throw err;
  }

  // Check for overlaps with other appointments for the same therapist
  const overlappingAppointment = await prisma.appointment.findFirst({
    where: {
      therapistId: appointment.therapistId,
      id: { not: id },
      deletedAt: null,
      status: { in: ["SCHEDULED", "CONFIRMED"] },
      OR: [
        {
          // New appointment starts within existing appointment
          scheduledStartAt: { lt: endDate },
          scheduledEndAt: { gt: startDate },
        },
      ],
    },
  });

  if (overlappingAppointment) {
    const err = new Error("Therapist has conflicting appointment at this time");
    err.statusCode = 409;
    throw err;
  }

  return prisma.appointment.update({
    where: { id },
    data: {
      scheduledStartAt,
      scheduledEndAt,
      rescheduledAt: new Date(),
      status: "SCHEDULED",
    },
    include: { therapist: true, slot: true, chat: true },
  });
}

async function cancel({ userId, id }) {
  const appointment = await prisma.appointment.findFirst({
    where: { id, userId, deletedAt: null },
  });

  if (!appointment) {
    const err = new Error("Appointment not found");
    err.statusCode = 404;
    throw err;
  }

  if (appointment.status === "CANCELED") {
    return appointment;
  }

  return prisma.$transaction(async (tx) => {
    // Update appointment status
    const updated = await tx.appointment.update({
      where: { id },
      data: {
        status: "CANCELED",
        canceledAt: new Date(),
      },
      include: { therapist: true, slot: true, chat: true },
    });

    // Free up the therapist slot if one was allocated
    if (appointment.slotId) {
      await tx.therapistSlot.update({
        where: { id: appointment.slotId },
        data: { status: "AVAILABLE" },
      });
    }

    return updated;
  });
}

module.exports = {
  create,
  upcoming,
  getById,
  reschedule,
  cancel,
};
