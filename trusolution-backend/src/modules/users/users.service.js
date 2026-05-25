const prisma = require("../../config/prisma");

async function updateMe({ userId, data }) {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      fullName: data.fullName,
      username: data.username,
      bio: data.bio,
      avatarUrl: data.avatarUrl,
      profileMode: data.profileMode,
      maskedNickname: data.maskedNickname,
      maskedAvatarKey: data.maskedAvatarKey,
      sharingMode: data.sharingMode,
      focusMode: data.focusMode,
      lastSeenAt: new Date(),
    },
    include: { preference: true, issues: { include: { issue: true } } },
  });

  return user;
}

async function getPreferences({ userId }) {
  const prefs = await prisma.userPreference.findUnique({
    where: { userId },
  });

  if (prefs) {
    return prefs;
  }

  return prisma.userPreference.create({
    data: { userId },
  });
}

async function updatePreferences({ userId, data }) {
  const prefs = await prisma.userPreference.upsert({
    where: { userId },
    create: {
      userId,
      ...data,
    },
    update: {
      ...data,
    },
  });

  return prefs;
}

async function replaceIssues({ userId, issueIds }) {
  const uniqueIssueIds = Array.from(new Set(issueIds));

  const issues = await prisma.issue.findMany({
    where: {
      id: { in: uniqueIssueIds },
      isActive: true,
      deletedAt: null,
    },
    select: { id: true },
  });

  if (issues.length !== uniqueIssueIds.length) {
    const err = new Error("One or more issues are invalid or inactive");
    err.statusCode = 400;
    throw err;
  }

  await prisma.$transaction([
    prisma.userIssue.deleteMany({ where: { userId } }),
    prisma.userIssue.createMany({
      data: uniqueIssueIds.map((issueId) => ({ userId, issueId })),
      skipDuplicates: true,
    }),
  ]);

  const updated = await prisma.user.findUnique({
    where: { id: userId },
    include: { issues: { include: { issue: true } } },
  });

  return { issues: updated?.issues || [] };
}

module.exports = {
  updateMe,
  getPreferences,
  updatePreferences,
  replaceIssues,
};

