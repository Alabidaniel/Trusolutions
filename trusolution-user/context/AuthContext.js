import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth/react-native";
import { auth } from "../config/firebase";
import { apiRequest } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [loading, setLoading] = useState(false);

  const syncAndLoad = async () => {
    // /auth/sync ensures MySQL user exists, /auth/me returns full profile.
    await apiRequest("/auth/sync", { method: "POST" });
    const me = await apiRequest("/auth/me");
    setProfile(me);
    return me;
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user || null);

      if (!user) {
        setProfile(null);
        setInitializing(false);
        return;
      }

      try {
        await syncAndLoad();
      } catch (err) {
        // Keep firebase session, but profile load failed (e.g. backend offline).
        setProfile(null);
      } finally {
        setInitializing(false);
      }
    });

    return () => unsub();
  }, []);

  const signUp = async (email, password) => {
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password);
      return syncAndLoad();
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      return syncAndLoad();
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setProfile(null);
      setFirebaseUser(null);
    } finally {
      setLoading(false);
    }
  };

  const value = useMemo(
    () => ({
      firebaseUser,
      profile,
      initializing,
      loading,
      signUp,
      signIn,
      logout,
      refreshProfile: syncAndLoad,
    }),
    [firebaseUser, profile, initializing, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

