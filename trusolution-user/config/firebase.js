import { initializeApp, getApps } from "firebase/app";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAuth, initializeAuth } from "firebase/auth";

function requireEnv(name, defaultValue = null) {
  const value = process.env[name];
  if (!value && defaultValue === null) {
    // Only throw if no default and not available
    if (!process.env.NODE_ENV || process.env.NODE_ENV === "production") {
      throw new Error(
        `Missing ${name}. Add it to your Expo env (EXPO_PUBLIC_*) and restart Metro.`,
      );
    }
    // In development, log warning but don't throw
    console.warn(
      `Missing ${name}. Add it to your .env.local (EXPO_PUBLIC_*) to use Firebase features.`,
    );
    return null;
  }
  return value || defaultValue;
}

const firebaseConfig = {
  apiKey: requireEnv("EXPO_PUBLIC_FIREBASE_API_KEY"),
  authDomain: requireEnv("EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN"),
  projectId: requireEnv("EXPO_PUBLIC_FIREBASE_PROJECT_ID"),
  storageBucket: requireEnv("EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: requireEnv("EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"),
  appId: requireEnv("EXPO_PUBLIC_FIREBASE_APP_ID"),
};

// Validate we have minimum required config
const hasRequiredConfig =
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId;

let app = null;
let auth = null;

if (hasRequiredConfig) {
  app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  auth = getAuth(app);
} else {
  console.warn(
    "Firebase is not fully configured. Auth features will be unavailable.",
  );
}

export { app, auth };
