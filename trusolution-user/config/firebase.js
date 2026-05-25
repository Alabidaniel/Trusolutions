import { initializeApp, getApps } from "firebase/app";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth/react-native";

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing ${name}. Add it to your Expo env (EXPO_PUBLIC_*) and restart Metro.`,
    );
  }
  return value;
}

const firebaseConfig = {
  apiKey: requireEnv("EXPO_PUBLIC_FIREBASE_API_KEY"),
  authDomain: requireEnv("EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN"),
  projectId: requireEnv("EXPO_PUBLIC_FIREBASE_PROJECT_ID"),
  storageBucket: requireEnv("EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: requireEnv("EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"),
  appId: requireEnv("EXPO_PUBLIC_FIREBASE_APP_ID"),
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

// In React Native we should use initializeAuth + AsyncStorage persistence.
// If auth is already initialized (e.g. Fast Refresh), fall back to getAuth().
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (err) {
  auth = getAuth(app);
}

export { app, auth };

