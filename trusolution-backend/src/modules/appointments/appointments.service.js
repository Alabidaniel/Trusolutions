const prisma = require("../../config/prisma");

function buildBookingCode() {
  return `BK-${Math.floor(100000 + Math.random() * 900000).toString()}`;
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

    let bookingCode = buildBookingCode();
    // Best-effort collision avoidance
    for (let i = 0; i < 3; i += 1) {
      const exists = await tx.appointment.findFirst({
        where: { bookingCode },
        select: { id: true },
      });
      if (!exists) break;
      bookingCode = buildBookingCode();
    }

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

  return prisma.appointment.update({
    where: { id },
    data: {
      scheduledStartAt: data.scheduledStartAt,
      scheduledEndAt: data.scheduledEndAt,
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

  return prisma.appointment.update({
    where: { id },
    data: {
      status: "CANCELED",
      canceledAt: new Date(),
    },
    include: { therapist: true, slot: true, chat: true },
  });
}

module.exports = {
  create,
  upcoming,
  getById,
  reschedule,
  cancel,
};

