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

    // Enterprise note: real matching should be async (queue/worker). For now we create
    // a self-contained session+chat immediately so the existing frontend flow works.
    const session = await tx.session.create({
      data: {
        requesterUserId: userId,
        peerUserId: null,
        conversationStyle: data.conversationStyle,
        topics: data.topics,
        status: "ACTIVE",
      },
    });

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

  const rating = await prisma.peerRating.upsert({
    where: { sessionId },
    create: {
      sessionId,
      raterUserId: userId,
      rating: data.rating,
      feedback: data.feedback,
    },
    update: {
      rating: data.rating,
      feedback: data.feedback,
    },
  });

  return rating;
}

module.exports = {
  createMatchRequest,
  getMatchRequest,
  cancelMatchRequest,
  rateSession,
};

