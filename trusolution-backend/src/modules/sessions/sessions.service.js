const prisma = require("../../config/prisma");

async function createMatchRequest({ userId, data }) {
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  const result = await prisma.$transaction(async (tx) => {
    const matchRequest = await tx.matchRequest.create({
      data: {
        requesterUserId: userId,
        conversationStyle: data.conversationStyle,
        topics: data.topics,
        status: "PENDING",
        expiresAt,
      },
    });

    // Create an immediate session for the requester. In production, matching would be async (queue/worker).
    // Frontend expects a session+chat to exist immediately so user can start typing.
    // peerUserId remains null until a peer joins via a separate match acceptance flow.
    const session = await tx.session.create({
      data: {
        requesterUserId: userId,
        peerUserId: null,
        conversationStyle: data.conversationStyle,
        topics: data.topics,
        status: "ACTIVE",
      },
    });

    // Create PEER chat with only the requester as participant initially
    const chat = await tx.chat.create({
      data: {
        type: "PEER",
        sessionId: session.id,
        lastMessageAt: null,
        participants: {
          create: [{ userId }],
        },
      },
    });

    const updatedMatchRequest = await tx.matchRequest.update({
      where: { id: matchRequest.id },
      data: {
        status: "MATCHED",
        matchedSessionId: session.id,
      },
    });

    return {
      matchRequest: updatedMatchRequest,
      session,
      chat,
    };
  });

  return result;
}

async function getMatchRequest({ userId, id }) {
  const matchRequest = await prisma.matchRequest.findFirst({
    where: { id, requesterUserId: userId },
    include: {
      matchedSession: {
        include: {
          chat: true,
        },
      },
    },
  });

  if (!matchRequest) {
    const err = new Error("Match request not found");
    err.statusCode = 404;
    throw err;
  }

  return matchRequest;
}

async function cancelMatchRequest({ userId, id }) {
  const matchRequest = await prisma.matchRequest.findFirst({
    where: { id, requesterUserId: userId },
  });

  if (!matchRequest) {
    const err = new Error("Match request not found");
    err.statusCode = 404;
    throw err;
  }

  if (matchRequest.status === "CANCELED") {
    return matchRequest;
  }

  return prisma.matchRequest.update({
    where: { id },
    data: {
      status: "CANCELED",
      canceledAt: new Date(),
    },
  });
}

async function rateSession({ userId, sessionId, data }) {
  const session = await prisma.session.findFirst({
    where: {
      id: sessionId,
      deletedAt: null,
      OR: [{ requesterUserId: userId }, { peerUserId: userId }],
    },
  });

  if (!session) {
    const err = new Error("Session not found");
    err.statusCode = 404;
    throw err;
  }

  // Business rule: only allow rating completed sessions
  if (session.status !== "COMPLETED") {
    const err = new Error("Cannot rate an incomplete session");
    err.statusCode = 400;
    throw err;
  }

  // Business rule: validate rating value
  const rating = Number(data.rating);
  if (Number.isNaN(rating) || rating < 1 || rating > 5) {
    const err = new Error("Rating must be between 1 and 5");
    err.statusCode = 400;
    throw err;
  }

  const peerRating = await prisma.peerRating.upsert({
    where: { sessionId },
    create: {
      sessionId,
      raterUserId: userId,
      rating,
      feedback: data.feedback || null,
    },
    update: {
      rating,
      feedback: data.feedback || null,
    },
  });

  return peerRating;
}

module.exports = {
  createMatchRequest,
  getMatchRequest,
  cancelMatchRequest,
  rateSession,
};
