const prisma = require("../../config/prisma");
const { parsePagination } = require("../../utils/pagination");

async function createTicket({ userId, data }) {
  return prisma.supportTicket.create({
    data: {
      userId,
      subject: data.subject || null,
      message: data.message,
      priority: data.priority || "MEDIUM",
      status: "OPEN",
    },
  });
}

async function listTickets({ userId, query }) {
  const { page, limit, skip, take } = parsePagination(query);
  const status = query.status ? String(query.status) : null;

  const where = {
    userId,
    deletedAt: null,
    ...(status ? { status } : {}),
  };

  const [items, total] = await prisma.$transaction([
    prisma.supportTicket.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take,
    }),
    prisma.supportTicket.count({ where }),
  ]);

  return { items, pageInfo: { page, limit, total, totalPages: Math.ceil(total / limit) } };
}

module.exports = {
  createTicket,
  listTickets,
};

