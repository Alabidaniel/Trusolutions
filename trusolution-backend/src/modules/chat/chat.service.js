const prisma = require("../../config/prisma");

async function assertParticipant({ chatId, userId }) {
  const participant = await prisma.chatParticipant.findFirst({
    where: { chatId, userId },
    select: { id: true },
  });

  if (!participant) {
    const err = new Error("Forbidden");
    err.statusCode = 403;
    throw err;
  }
}

async function listMessages({ userId, chatId, query }) {
  await assertParticipant({ chatId, userId });

  const limit = Math.max(1, Math.min(50, Number(query.limit || 30) || 30));
  const order = query.order === "asc" ? "asc" : "desc";
  const cursor = query.cursor ? String(query.cursor) : null;

  const where = { chatId, deletedAt: null };

  const messages = await prisma.message.findMany({
    where,
    ...(cursor
      ? {
          cursor: { id: cursor },
          skip: 1,
        }
      : {}),
    take: limit,
    orderBy: { createdAt: order },
  });

  return { items: messages };
}

async function createMessage({ userId, chatId, body }) {
  await assertParticipant({ chatId, userId });

  const message = await prisma.$transaction(async (tx) => {
    const msg = await tx.message.create({
      data: {
        chatId,
        senderUserId: userId,
        messageType: "TEXT",
        body,
      },
    });

    await tx.chat.update({
      where: { id: chatId },
      data: { lastMessageAt: msg.createdAt },
    });

    return msg;
  });

  return message;
}

module.exports = {
  listMessages,
  createMessage,
};

