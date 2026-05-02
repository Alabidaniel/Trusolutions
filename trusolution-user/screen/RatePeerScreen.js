import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function RatePeerScreen({ route }) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { peerName = "Alex" } = route.params || {};
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  const stars = [1, 2, 3, 4, 5];

  const closeChat = () => {
    console.log("Rating:", rating, "Feedback:", feedback);
    navigation.navigate("MainTabs", { screen: "Home" });
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#6B3A24" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rate {peerName}</Text>
      </View>

      <View style={styles.content}>
        <Ionicons
          name="person-circle"
          size={100}
          color="#F7EBDD"
          style={styles.avatar}
        />

        <Text style={styles.title}>How was your chat experience?</Text>
        <Text style={styles.subtitle}>Your feedback helps others</Text>

        <View style={styles.starsContainer}>
          {stars.map((star) => (
            <TouchableOpacity
              key={star}
              onPress={() => setRating(star)}
              style={[styles.star, rating >= star && styles.starFilled]}
            >
              <Ionicons
                name={rating >= star ? "star" : "star-outline"}
                size={32}
                color="#6B3A24"
              />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.feedbackSection}>
          <Text style={styles.sectionTitle}>Additional feedback</Text>
          <TextInput
            style={styles.feedbackInput}
            placeholder="Optional - share your thoughts..."
            placeholderTextColor="#8B7355"
            multiline
            numberOfLines={4}
            value={feedback}
            onChangeText={setFeedback}
          />
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.endChatBtn} onPress={closeChat}>
            <Text style={styles.endChatText}>End Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.submitBtn, rating === 0 && styles.submitBtnDisabled]}
            onPress={closeChat}
            disabled={rating === 0}
          >
            <Text style={styles.submitText}>Submit Feedback</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5E6CB",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#F7EBDD",
    borderBottomWidth: 1,
    borderBottomColor: "#D4B87A",
  },
  backBtn: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#6B3A24",
    flex: 1,
    marginLeft: 10,
  },
  content: {
    flex: 1,
    alignItems: "center",
    padding: 30,
  },
  avatar: {
    marginBottom: 30,
    backgroundColor: "#F7EBDD",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6B3A24",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#8B7355",
    textAlign: "center",
    marginBottom: 40,
  },
  starsContainer: {
    flexDirection: "row",
    marginBottom: 40,
  },
  star: {
    padding: 10,
  },
  starFilled: {
    backgroundColor: "#F7EBDD",
    borderRadius: 25,
  },
  feedbackSection: {
    width: "100%",
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B3A24",
    marginBottom: 12,
  },
  feedbackInput: {
    borderWidth: 1,
    borderColor: "#D4B87A",
    borderRadius: 15,
    backgroundColor: "#fff",
    padding: 16,
    fontSize: 15,
    textAlignVertical: "top",
    minHeight: 100,
  },
  buttonsContainer: {
    flexDirection: "row",
    width: "100%",
    gap: 16,
  },
  endChatBtn: {
    flex: 1,
    backgroundColor: "#F7EBDD",
    paddingVertical: 16,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#6B3A24",
    alignItems: "center",
  },
  endChatText: {
    color: "#6B3A24",
    fontWeight: "bold",
    fontSize: 16,
  },
  submitBtn: {
    flex: 1,
    backgroundColor: "#6B3A24",
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: "center",
  },
  submitBtnDisabled: {
    backgroundColor: "#D4B87A",
  },
  submitText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
