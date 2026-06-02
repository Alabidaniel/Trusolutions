import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  BackHandler,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { apiRequest } from "../api/client";

export default function PeerChatScreen({ route }) {
  const navigation = useNavigation();
  const {
    chatId,
    conversationStyle = "Both",
    peerName = "Chat",
    chatType = "peer",
  } = route.params || {};
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const flatListRef = useRef();
  const insets = useSafeAreaInsets();

  // Load messages from backend on mount and periodically
  useEffect(() => {
    if (!chatId) {
      setError("Chat ID not provided");
      setLoading(false);
      return;
    }

    let alive = true;

    const loadMessages = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiRequest(`/chats/${chatId}/messages`, {
          query: { limit: 50, order: "asc" },
        });
        if (alive) {
          const formattedMessages = (result.items || []).map((msg) => ({
            id: msg.id,
            text: msg.body,
            sender: msg.senderUserId ? "peer" : "user",
            time: new Date(msg.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            raw: msg,
          }));
          setMessages(formattedMessages);
        }
      } catch (err) {
        if (alive) {
          const errorMsg = err?.message || "Failed to load messages";
          setError(errorMsg);
          Alert.alert("Error", errorMsg);
        }
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    };

    loadMessages();

    // Poll for new messages every 3 seconds
    const pollInterval = setInterval(loadMessages, 3000);

    return () => {
      alive = false;
      clearInterval(pollInterval);
    };
  }, [chatId]);

  const handleBackPress = React.useCallback(() => {
    if (chatType === "therapist") {
      navigation.goBack();
      return;
    }
    // Navigate back to peer chat list
    navigation.goBack();
  }, [chatType, navigation]);

  useFocusEffect(
    React.useCallback(() => {
      if (Platform.OS !== "android") {
        return undefined;
      }

      const onBackPress = () => {
        handleBackPress();
        return true;
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress,
      );

      return () => subscription.remove();
    }, [handleBackPress]),
  );

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: false });
  }, [messages]);

  const statusLabel =
    chatType === "therapist"
      ? "Available now • Professional support"
      : `Online • ${conversationStyle} style`;

  const sendMessage = async () => {
    if (!inputText.trim() || !chatId) {
      return;
    }

    const messageText = inputText.trim();
    setInputText("");

    // Optimistic add to UI
    const optimisticMessage = {
      id: `temp-${Date.now()}`,
      text: messageText,
      sender: "user",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, optimisticMessage]);

    try {
      setSending(true);
      await apiRequest(`/chats/${chatId}/messages`, {
        method: "POST",
        body: { body: messageText },
      });
      // Message sent successfully; will be refreshed in polling
    } catch (err) {
      // Rollback optimistic add on failure
      setMessages((prev) => prev.filter((m) => m.id !== optimisticMessage.id));
      Alert.alert("Failed to send message", err?.message || "Please try again.");
    } finally {
      setSending(false);
    }
  };

  const renderMessage = ({ item, index }) => {
    const isUser = item.sender === "user";
    const previousMessage = messages[index - 1];
    const showAvatar = !isUser && previousMessage?.sender !== "peer";

    return (
      <View style={[styles.messageRow, isUser && styles.userRow]}>
        {!isUser && (
          <View style={styles.avatarSlot}>
            {showAvatar ? (
              <View style={styles.peerAvatar}>
                <Text style={styles.peerAvatarText}>
                  {peerName.charAt(0).toUpperCase()}
                </Text>
              </View>
            ) : null}
          </View>
        )}

        <View
          style={[
            styles.bubble,
            isUser ? styles.userBubble : styles.peerBubble,
          ]}
        >
          <Text style={[styles.messageText, isUser && styles.userMessageText]}>
            {item.text}
          </Text>
          <Text style={[styles.timeText, isUser && styles.userTimeText]}>
            {item.time}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <KeyboardAvoidingView
        style={styles.flex1}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 8 : 0}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconButton} onPress={handleBackPress}>
            <Ionicons name="arrow-back" size={22} color="#2D2418" />
          </TouchableOpacity>

          <View style={styles.headerIdentity}>
            <View style={styles.headerAvatar}>
              <Text style={styles.headerAvatarText}>
                {peerName.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.headerTextWrap}>
              <Text style={styles.peerName} numberOfLines={1}>
                {peerName}
              </Text>
              <Text style={styles.peerStatus} numberOfLines={1}>
                {statusLabel}
              </Text>
            </View>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="call-outline" size={20} color="#2D2418" />
            </TouchableOpacity>
            {chatType !== "therapist" && (
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => navigation.navigate("RatePeer", { peerName })}
              >
                <Ionicons name="star-outline" size={20} color="#2D2418" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.dateDividerWrap}>
          <Text style={styles.dateDivider}>Today</Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#7A4B2F" />
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={40} color="#D97706" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            style={styles.messagesList}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.messagesContent,
              { paddingBottom: 12 + insets.bottom },
            ]}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No messages yet. Start the conversation!</Text>
              </View>
            }
          />
        )}

        <View
          style={[
            styles.composerWrap,
            { paddingBottom: Math.max(insets.bottom, 10) },
          ]}
        >
          <View style={styles.composer}>
            <TouchableOpacity style={styles.composerIcon}>
              <Ionicons name="happy-outline" size={22} color="#7B6A55" />
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="Message"
              placeholderTextColor="#9C8B75"
              value={inputText}
              onChangeText={setInputText}
              multiline
            />
            <TouchableOpacity style={styles.composerIcon}>
              <Ionicons name="attach-outline" size={22} color="#7B6A55" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.composerIcon}>
              <Ionicons name="camera-outline" size={22} color="#7B6A55" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              styles.sendButton,
              (!inputText.trim() || sending) && styles.sendButtonDisabled,
            ]}
            onPress={sendMessage}
            disabled={!inputText.trim() || sending}
          >
            <Ionicons name="send" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D8C8A8",
  },
  flex1: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#E9DDC2",
    borderBottomWidth: 1,
    borderBottomColor: "#CCBC98",
  },
  headerIdentity: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 8,
  },
  headerAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#7B5B3D",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  headerAvatarText: {
    color: "#FFF7E7",
    fontSize: 18,
    fontWeight: "800",
  },
  headerTextWrap: {
    flex: 1,
  },
  peerName: {
    fontSize: 16,
    fontWeight: "800",
    color: "#2D2418",
  },
  peerStatus: {
    fontSize: 12,
    color: "#6E604D",
    marginTop: 2,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  dateDividerWrap: {
    alignItems: "center",
    paddingTop: 10,
  },
  dateDivider: {
    backgroundColor: "rgba(255, 248, 230, 0.88)",
    color: "#6E604D",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    fontSize: 12,
    fontWeight: "700",
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  errorText: {
    color: "#D97706",
    fontSize: 14,
    marginTop: 12,
    textAlign: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "#6E604D",
    fontSize: 14,
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 8,
  },
  userRow: {
    justifyContent: "flex-end",
  },
  avatarSlot: {
    width: 36,
    alignItems: "center",
    justifyContent: "flex-end",
    marginRight: 6,
  },
  peerAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#C9B18D",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  peerAvatarText: {
    color: "#4A3928",
    fontWeight: "800",
    fontSize: 12,
  },
  bubble: {
    maxWidth: "78%",
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  peerBubble: {
    backgroundColor: "#FFF7E9",
    borderTopLeftRadius: 6,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  userBubble: {
    backgroundColor: "#7B5B3D",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 6,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 21,
    color: "#2D2418",
  },
  userMessageText: {
    color: "#FFF8EC",
  },
  timeText: {
    alignSelf: "flex-end",
    marginTop: 6,
    fontSize: 11,
    color: "#8E7C65",
  },
  userTimeText: {
    color: "#E8DAC7",
  },
  composerWrap: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 10,
    paddingTop: 8,
    backgroundColor: "#E9DDC2",
    borderTopWidth: 1,
    borderTopColor: "#CCBC98",
  },
  composer: {
    flex: 1,
    minHeight: 50,
    maxHeight: 110,
    backgroundColor: "#FFF9EE",
    borderRadius: 26,
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  composerIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#2D2418",
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 8,
    maxHeight: 96,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#7B5B3D",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: "#B4A288",
  },
});
