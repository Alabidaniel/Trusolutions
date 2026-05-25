const prisma = require("../../config/prisma");
const { parsePagination } = require("../../utils/pagination");

function toDateKey(date) {
  return date.toISOString().slice(0, 10);
}

function dayDiff(a, b) {
  const aMid = new Date(a.getFullYear(), a.getMonth(), a.getDate());
  const bMid = new Date(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.round((aMid - bMid) / (24 * 60 * 60 * 1000));
}

async function createEntry({ userId, data }) {
  const score = data.severity + 1;

  return prisma.moodEntry.create({
    data: {
      userId,
      mood: data.mood,
      severity: data.severity,
      score,
      recordedAt: new Date(),
    },
  });
}

async function listEntries({ userId, query }) {
  const { page, limit, skip, take } = parsePagination(query);

  const where = { userId, deletedAt: null };

  const [items, total] = await prisma.$transaction([
    prisma.moodEntry.findMany({
      where,
      orderBy: { recordedAt: "desc" },
      skip,
      take,
    }),
    prisma.moodEntry.count({ where }),
  ]);

  return { items, pageInfo: { page, limit, total, totalPages: Math.ceil(total / limit) } };
}

async function summary({ userId }) {
  const entries = await prisma.moodEntry.findMany({
    where: {
      userId,
      deletedAt: null,
      recordedAt: { gte: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000) },
    },
    orderBy: { recordedAt: "desc" },
    select: { recordedAt: true, mood: true, severity: true, score: true, id: true },
  });

  const uniqueDays = [];
  const seen = new Set();
  for (const e of entries) {
    const key = toDateKey(e.recordedAt);
    if (!seen.has(key)) {
      seen.add(key);
      uniqueDays.push(e);
    }
  }

  let streak = 0;
  const today = new Date();
  let lastDate = today;

  for (const e of uniqueDays) {
    const diff = dayDiff(lastDate, e.recordedAt);
    if (diff === 0 || diff === 1) {
      streak += 1;
      lastDate = e.recordedAt;
      continue;
    }
    break;
  }

  return {
    streakDays: streak,
    lastEntry: entries[0] || null,
  };
}

async function weekly({ userId }) {
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const entries = await prisma.moodEntry.findMany({
    where: { userId, deletedAt: null, recordedAt: { gte: since } },
    orderBy: { recordedAt: "asc" },
    select: { recordedAt: true, score: true, mood: true, severity: true },
  });

  return { entries, since };
}

module.exports = {
  createEntry,
  listEntries,
  summary,
  weekly,
};

