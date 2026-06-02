import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { apiRequest } from "../api/client";
import { useAuth } from "./AuthContext";

const CommunityContext = createContext(null);

function formatTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString();
}

function normalizePost(p) {
  return {
    id: p.id,
    author: p.authorDisplayName || "User",
    isAnonymous: Boolean(p.isAnonymous),
    title: p.title,
    experience: p.body,
    topics: Array.isArray(p.topics) ? p.topics : [],
    createdAt: formatTime(p.createdAt),
    liked: Boolean(p.liked),
    likes: Number(p.likesCount || 0),
    reaction: p.reaction ? String(p.reaction).toLowerCase() : null,
    commentsCount: Number(p.commentsCount || 0),
    comments: [],
  };
}

export function CommunityProvider({ children }) {
  const { firebaseUser, initializing } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const firebaseUid = firebaseUser?.uid || null;

  const refresh = async () => {
    setLoading(true);
    try {
      const result = await apiRequest("/community/posts", {
        query: { page: 1, limit: 30 },
      });
      const items = result?.items || [];
      setPosts(items.map(normalizePost));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initializing) {
      return;
    }

    if (!firebaseUid) {
      setPosts([]);
      setLoading(false);
      return;
    }

    refresh().catch(() => {
      setLoading(false);
    });
  }, [firebaseUid, initializing]);

  const addPost = async ({ title, experience, topics, isAnonymous }) => {
    const post = await apiRequest("/community/posts", {
      method: "POST",
      body: {
        title: title.trim(),
        body: experience.trim(),
        topics: topics || [],
        isAnonymous,
      },
    });

    // Optimistic insert using backend field names; then refresh to pull correct counts + author display.
    setPosts((prev) => [
      {
        id: post.id,
        author: post.authorDisplayName || (isAnonymous ? "Anonymous" : "You"),
        isAnonymous: Boolean(isAnonymous),
        title: post.title,
        experience: post.body,
        topics: post.topics || [],
        createdAt: "Just now",
        liked: false,
        likes: 0,
        reaction: null,
        commentsCount: 0,
        comments: [],
      },
      ...prev,
    ]);

    refresh().catch(() => {});
    return post;
  };

  const toggleLike = async (postId) => {
    const current = posts.find((p) => p.id === postId);
    const nextLiked = !current?.liked;

    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              liked: nextLiked,
              likes: nextLiked ? p.likes + 1 : Math.max(0, p.likes - 1),
            }
          : p,
      ),
    );

    try {
      const result = await apiRequest(`/community/posts/${postId}/like`, {
        method: "PUT",
        body: { liked: nextLiked },
      });
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? { ...p, liked: result.liked, likes: result.likesCount }
            : p,
        ),
      );
    } catch (err) {
      // Roll back on failure.
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? {
                ...p,
                liked: !nextLiked,
                likes: !nextLiked ? p.likes + 1 : Math.max(0, p.likes - 1),
              }
            : p,
        ),
      );
      throw err;
    }
  };

  const setReaction = async (postId, reaction) => {
    const next = reaction ? reaction.toUpperCase() : null;

    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, reaction } : p)),
    );

    try {
      const result = await apiRequest(`/community/posts/${postId}/reaction`, {
        method: "PUT",
        body: { reaction: next },
      });
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? {
                ...p,
                reaction: result.reaction
                  ? result.reaction.toLowerCase()
                  : null,
              }
            : p,
        ),
      );
    } catch (err) {
      refresh().catch(() => {});
      throw err;
    }
  };

  const addComment = async (postId, text) => {
    const trimmedText = text.trim();
    if (!trimmedText) {
      return;
    }

    const comment = await apiRequest(`/community/posts/${postId}/comments`, {
      method: "POST",
      body: { body: trimmedText },
    });

    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              commentsCount: (p.commentsCount || 0) + 1,
              comments: [
                ...p.comments,
                {
                  id: comment.id,
                  author: "You",
                  text: comment.body,
                },
              ],
            }
          : p,
      ),
    );
  };

  const value = useMemo(
    () => ({
      posts,
      loading,
      refresh,
      addPost,
      toggleLike,
      setReaction,
      addComment,
    }),
    [posts, loading],
  );

  return (
    <CommunityContext.Provider value={value}>
      {children}
    </CommunityContext.Provider>
  );
}

export function useCommunity() {
  const value = useContext(CommunityContext);
  if (!value) {
    throw new Error("useCommunity must be used within CommunityProvider");
  }
  return value;
}
