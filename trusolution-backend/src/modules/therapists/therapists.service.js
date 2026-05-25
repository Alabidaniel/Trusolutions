const prisma = require("../../config/prisma");
const { parsePagination } = require("../../utils/pagination");

async function list({ query }) {
  const { page, limit, skip, take } = parsePagination(query);
  const q = (query.q || "").toString().trim();
  const specialty = (query.specialty || "").toString().trim();

  const where = {
    deletedAt: null,
    isActive: true,
    ...(q
      ? {
          OR: [
            { displayName: { contains: q } },
            { specialty: { contains: q } },
          ],
        }
      : {}),
    ...(specialty ? { specialty: { contains: specialty } } : {}),
  };

  const [items, total] = await prisma.$transaction([
    prisma.therapist.findMany({
      where,
      orderBy: [{ ratingAvg: "desc" }, { sessionsCount: "desc" }],
      skip,
      take,
    }),
    prisma.therapist.count({ where }),
  ]);

  return {
    items,
    pageInfo: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

async function getById({ id }) {
  const therapist = await prisma.therapist.findFirst({
    where: { id, deletedAt: null, isActive: true },
  });

  if (!therapist) {
    const err = new Error("Therapist not found");
    err.statusCode = 404;
    throw err;
  }

  return therapist;
}

async function listSlots({ therapistId, query }) {
  const { page, limit, skip, take } = parsePagination(query);

  const where = {
    therapistId,
    deletedAt: null,
    status: "AVAILABLE",
    startAt: { gte: new Date() },
  };

  const [items, total] = await prisma.$transaction([
    prisma.therapistSlot.findMany({
      where,
      orderBy: { startAt: "asc" },
      skip,
      take,
    }),
    prisma.therapistSlot.count({ where }),
  ]);

  return {
    items,
    pageInfo: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

module.exports = {
  list,
  getById,
  listSlots,
};

