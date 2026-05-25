const prisma = require("../config/prisma");
const { getAuth } = require("../config/firebase");
const { errorResponse } = require("../utils/response");

function extractBearerToken(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || typeof authHeader !== "string") {
    return null;
  }

  if (!authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.slice("Bearer ".length).trim();
  return token || null;
}

async function verifyFirebaseToken(req, res, next) {
  try {
    const idToken = extractBearerToken(req);
    if (!idToken) {
      return errorResponse(res, 401, "Authorization token missing or invalid format");
    }

    const decodedToken = await getAuth().verifyIdToken(idToken);
    req.firebase = decodedToken;
    return next();
  } catch (err) {
    if (err?.code === "FIREBASE_ENV_MISSING") {
      return errorResponse(res, 500, err.message);
    }

    const code = err?.code;
    if (code === "auth/id-token-expired") {
      return errorResponse(res, 401, "Token expired");
    }
    if (code === "auth/id-token-revoked") {
      return errorResponse(res, 401, "Token revoked");
    }
    if (code === "auth/invalid-id-token") {
      return errorResponse(res, 401, "Invalid token");
    }

    return errorResponse(res, 401, "Authentication failed");
  }
}

async function requireUser(req, res, next) {
  try {
    if (!req.firebase?.uid) {
      return errorResponse(res, 401, "Authentication failed");
    }

    const user = await prisma.user.findUnique({
      where: { firebaseUid: req.firebase.uid },
    });

    if (!user) {
      return errorResponse(res, 401, "User not synced. Call POST /api/v1/auth/sync");
    }

    req.user = user;
    return next();
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  verifyFirebaseToken,
  requireUser,
};
