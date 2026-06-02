import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../config/firebase";
import { apiRequest } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastSyncError, setLastSyncError] = useState(null);

  const syncAndLoad = async () => {
    try {
      // /auth/sync ensures MySQL user exists, /auth/me returns full profile.
      await apiRequest("/auth/sync", { method: "POST" });
      const me = await apiRequest("/auth/me");
      setProfile(me);
      setLastSyncError(null);
      return me;
    } catch (err) {
      // Track the error for display/retry
      const errorMsg = err?.message || "Failed to sync profile with backend";
      setLastSyncError(errorMsg);
      throw err;
    }
  };

  useEffect(() => {
    if (!auth) {
      // Firebase not configured
      setInitializing(false);
      setError("Firebase is not properly configured");
      return;
    }

    const unsub = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user || null);

      if (!user) {
        setProfile(null);
        setInitializing(false);
        setError(null);
        setLastSyncError(null);
        return;
      }

      try {
        await syncAndLoad();
      } catch (err) {
        // Keep firebase session alive, but track profile load failure
        setProfile(null);
        const errorMsg = err?.message || "Failed to load profile from backend";
        setError(errorMsg);
        // Don't throw, allow app to continue with degraded functionality
      } finally {
        setInitializing(false);
      }
    });

    return () => unsub();
  }, []);

  const signUp = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password);
      return await syncAndLoad();
    } catch (err) {
      const errorMsg = err?.message || "Sign up failed";
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      return await syncAndLoad();
    } catch (err) {
      const errorMsg = err?.message || "Sign in failed";
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await signOut(auth);
      setProfile(null);
      setFirebaseUser(null);
      setLastSyncError(null);
    } catch (err) {
      const errorMsg = err?.message || "Logout failed";
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Allow manual retry of profile sync
  const retrySync = async () => {
    setLoading(true);
    setError(null);
    try {
      await syncAndLoad();
    } catch (err) {
      const errorMsg = err?.message || "Failed to sync profile";
      setError(errorMsg);
      throw err;
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
      error,
      lastSyncError,
      signUp,
      signIn,
      logout,
      refreshProfile: syncAndLoad,
      retrySync,
    }),
    [firebaseUser, profile, initializing, loading, error, lastSyncError],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
