const prisma = require("../../config/prisma");

function buildUserIncludes() {
  return {
    preference: true,
    issues: {
      include: {
        issue: true,
      },
    },
  };
}

async function syncUser({ firebase }) {
  const firebaseUid = firebase?.uid;
  if (!firebaseUid) {
    const err = new Error("Invalid Firebase token payload");
    err.statusCode = 401;
    throw err;
  }

  const email = firebase?.email;
  if (!email) {
    const err = new Error("Firebase user has no email. Email is required.");
    err.statusCode = 400;
    throw err;
  }

  const displayName = firebase?.name || firebase?.displayName || null;

  const user = await prisma.user.upsert({
    where: { firebaseUid },
    create: {
      firebaseUid,
      email,
      fullName: displayName,
      preference: {
        create: {},
      },
    },
    update: {
      email,
      fullName: displayName || undefined,
      preference: {
        upsert: {
          create: {},
          update: {},
        },
      },
    },
    include: buildUserIncludes(),
  });

  return user;
}

async function getMe({ userId }) {
  const user = await prisma.user.findFirst({
    where: { id: userId, deletedAt: null },
    include: buildUserIncludes(),
  });

  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }

  return user;
}

module.exports = {
  syncUser,
  getMe,
};

