import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCommunity } from "../context/CommunityContext";

const reactions = [
  { id: "support", emoji: "🤍", label: "Support" },
  { id: "relate", emoji: "🙏", label: "Relate" },
  { id: "hug", emoji: "🤗", label: "Hug" },
];

function FeedCard({ post, onLike, onReaction, onComment }) {
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);

  const submitComment = () => {
    const trimmed = commentText.trim();
    if (!trimmed) {
      return;
    }
    onComment(trimmed);
    setCommentText("");
    setShowComments(true);
  };

  return (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{post.author.charAt(0)}</Text>
        </View>
        <View style={styles.postMeta}>
          <Text style={styles.authorName}>{post.author}</Text>
          <Text style={styles.postTime}>{post.createdAt}</Text>
        </View>
      </View>

      <Text style={styles.postTitle}>{post.title}</Text>
      <Text style={styles.postBody}>{post.experience}</Text>

      <View style={styles.tagRow}>
        {post.topics.map((topic) => (
          <View key={topic} style={styles.tag}>
            <Text style={styles.tagText}>#{topic}</Text>
          </View>
        ))}
      </View>

      <View style={styles.postStats}>
        <Text style={styles.statText}>{post.likes} likes</Text>
        <Text style={styles.statText}>
          {post.commentsCount ?? post.comments.length} comments
        </Text>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.actionButton} onPress={onLike}>
          <Ionicons
            name={post.liked ? "heart" : "heart-outline"}
            size={18}
            color={post.liked ? "#B24A3A" : "#6A5845"}
          />
          <Text style={[styles.actionText, post.liked && styles.likedText]}>
            Like
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setShowComments((prev) => !prev)}
        >
          <Ionicons name="chatbubble-outline" size={18} color="#6A5845" />
          <Text style={styles.actionText}>Comment</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.reactionRow}>
        {reactions.map((reaction) => {
          const selected = post.reaction === reaction.id;
          return (
            <TouchableOpacity
              key={reaction.id}
              style={[
                styles.reactionChip,
                selected && styles.reactionChipActive,
              ]}
              onPress={() => onReaction(reaction.id)}
            >
              <Text style={styles.reactionEmoji}>{reaction.emoji}</Text>
              <Text
                style={[
                  styles.reactionLabel,
                  selected && styles.reactionLabelActive,
                ]}
              >
                {reaction.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.commentComposer}>
        <TextInput
          style={styles.commentInput}
          placeholder="Add a kind comment..."
          placeholderTextColor="#8A7963"
          value={commentText}
          onChangeText={setCommentText}
        />
        <TouchableOpacity style={styles.commentSend} onPress={submitComment}>
          <Ionicons name="send" size={16} color="#FFF8EC" />
        </TouchableOpacity>
      </View>

      {showComments && post.comments.length > 0 && (
        <View style={styles.commentList}>
          {post.comments.map((comment) => (
            <View key={comment.id} style={styles.commentItem}>
              <Text style={styles.commentAuthor}>{comment.author}</Text>
              <Text style={styles.commentText}>{comment.text}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

export default function InteractionModeScreen() {
  const insets = useSafeAreaInsets();
  const { posts, toggleLike, setReaction, addComment } = useCommunity();

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom + 70 },
      ]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Community Feed</Text>
          <Text style={styles.subtitle}>
            Shared experiences from people using the app
          </Text>
        </View>

        <View style={styles.feedIntro}>
          <Ionicons name="sparkles-outline" size={20} color="#7A4B2F" />
          <Text style={styles.feedIntroText}>
            Posts shared from `Share Experience` will appear here for the local
            community.
          </Text>
        </View>

        {posts.map((post) => (
          <FeedCard
            key={post.id}
            post={post}
            onLike={async () => {
              try {
                await toggleLike(post.id);
              } catch (err) {
                Alert.alert("Action failed", err?.message || "Please try again.");
              }
            }}
            onReaction={async (reaction) => {
              try {
                await setReaction(post.id, reaction);
              } catch (err) {
                Alert.alert("Action failed", err?.message || "Please try again.");
              }
            }}
            onComment={async (text) => {
              try {
                await addComment(post.id, text);
              } catch (err) {
                Alert.alert("Comment failed", err?.message || "Please try again.");
              }
            }}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5E6CB",
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 20,
  },
  header: {
    marginBottom: 14,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#4A2C1E",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: "#7A614F",
  },
  feedIntro: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F6ECD2",
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    gap: 10,
  },
  feedIntroText: {
    flex: 1,
    color: "#6A5845",
    fontSize: 13,
    lineHeight: 18,
  },
  postCard: {
    backgroundColor: "#FBF6E8",
    borderRadius: 22,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E3D3B0",
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#7A4B2F",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "#FFF8EC",
    fontWeight: "800",
    fontSize: 16,
  },
  postMeta: {
    flex: 1,
  },
  authorName: {
    fontSize: 15,
    fontWeight: "800",
    color: "#4A2C1E",
  },
  postTime: {
    fontSize: 12,
    color: "#8A7963",
    marginTop: 2,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#4A2C1E",
    marginBottom: 8,
  },
  postBody: {
    fontSize: 15,
    lineHeight: 22,
    color: "#5E4B39",
    marginBottom: 12,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  tag: {
    backgroundColor: "#F1E2B8",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
  },
  tagText: {
    color: "#6A4D36",
    fontSize: 12,
    fontWeight: "700",
  },
  postStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  statText: {
    fontSize: 12,
    color: "#8A7963",
  },
  actionRow: {
    flexDirection: "row",
    marginBottom: 12,
    gap: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#F4E8CA",
    borderRadius: 14,
  },
  actionText: {
    color: "#6A5845",
    fontWeight: "700",
  },
  likedText: {
    color: "#B24A3A",
  },
  reactionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 14,
  },
  reactionChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E3D3B0",
    backgroundColor: "#FFF8EC",
  },
  reactionChipActive: {
    backgroundColor: "#7A4B2F",
    borderColor: "#7A4B2F",
  },
  reactionEmoji: {
    fontSize: 14,
  },
  reactionLabel: {
    color: "#6A5845",
    fontWeight: "700",
    fontSize: 12,
  },
  reactionLabelActive: {
    color: "#FFF8EC",
  },
  commentComposer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4E8CA",
    borderRadius: 18,
    paddingLeft: 12,
    paddingRight: 6,
    paddingVertical: 6,
  },
  commentInput: {
    flex: 1,
    fontSize: 14,
    color: "#4A2C1E",
    paddingVertical: 8,
  },
  commentSend: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#7A4B2F",
    alignItems: "center",
    justifyContent: "center",
  },
  commentList: {
    marginTop: 12,
    gap: 8,
  },
  commentItem: {
    backgroundColor: "#F8EED9",
    padding: 10,
    borderRadius: 14,
  },
  commentAuthor: {
    fontSize: 12,
    fontWeight: "800",
    color: "#6A4D36",
    marginBottom: 4,
  },
  commentText: {
    fontSize: 13,
    lineHeight: 18,
    color: "#5E4B39",
  },
});
