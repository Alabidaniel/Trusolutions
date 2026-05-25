const prisma = require("../../config/prisma");
const { parsePagination } = require("../../utils/pagination");

async function list({ userId, query }) {
  const { page, limit, skip, take } = parsePagination(query);
  const unreadOnly = String(query.unreadOnly || "false") === "true";

  const where = {
    userId,
    deletedAt: null,
    ...(unreadOnly ? { readAt: null } : {}),
  };

  const [items, total] = await prisma.$transaction([
    prisma.notification.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take,
    }),
    prisma.notification.count({ where }),
  ]);

  return { items, pageInfo: { page, limit, total, totalPages: Math.ceil(total / limit) } };
}

async function readOne({ userId, id }) {
  const notification = await prisma.notification.findFirst({
    where: { id, userId, deletedAt: null },
  });

  if (!notification) {
    const err = new Error("Notification not found");
    err.statusCode = 404;
    throw err;
  }

  if (notification.readAt) {
    return notification;
  }

  return prisma.notification.update({
    where: { id },
    data: { readAt: new Date() },
  });
}

async function readAll({ userId }) {
  const result = await prisma.notification.updateMany({
    where: { userId, readAt: null, deletedAt: null },
    data: { readAt: new Date() },
  });

  return { updatedCount: result.count };
}

module.exports = {
  list,
  readOne,
  readAll,
};

