const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

let firebaseInitialized = false;

function getMissingFirebaseEnv() {
  const required = [
    "FIREBASE_PROJECT_ID",
    "FIREBASE_CLIENT_EMAIL",
    "FIREBASE_PRIVATE_KEY",
  ];
  return required.filter((key) => !process.env[key]);
}

function loadServiceAccountFromPath() {
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  if (!serviceAccountPath) {
    return null;
  }

  const candidates = [
    path.resolve(process.cwd(), serviceAccountPath),
    path.resolve(__dirname, "..", "..", serviceAccountPath),
  ];

  const resolvedPath = candidates.find((candidate) => fs.existsSync(candidate));
  if (!resolvedPath) {
    const err = new Error(
      `Firebase service account file not found: ${serviceAccountPath}`,
    );
    err.code = "FIREBASE_ENV_MISSING";
    throw err;
  }

  return require(resolvedPath);
}

function initFirebase() {
  if (firebaseInitialized) {
    return admin;
  }

  if (admin.apps && admin.apps.length > 0) {
    firebaseInitialized = true;
    return admin;
  }

  const serviceAccount = loadServiceAccountFromPath();
  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    firebaseInitialized = true;
    return admin;
  }

  const missing = getMissingFirebaseEnv();
  if (missing.length > 0) {
    const err = new Error(
      `Firebase Admin env missing: ${missing.join(", ")} or FIREBASE_SERVICE_ACCOUNT_PATH. See .env.example.`,
    );
    err.code = "FIREBASE_ENV_MISSING";
    throw err;
  }

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  });

  firebaseInitialized = true;
  return admin;
}

function getAuth() {
  if (!firebaseInitialized) {
    initFirebase();
  }
  return admin.auth();
}

module.exports = {
  initFirebase,
  getAuth,
  admin,
};
