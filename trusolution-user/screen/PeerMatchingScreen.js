import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Animated, Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

export default function PeerMatchingScreen({ route }) {
  const insets = useSafeAreaInsets();
  const { selectedTopics = [], conversationStyle = "Both" } =
    route.params || {};
  const [pulseAnim] = useState(new Animated.Value(1));
  const [dotsAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Pulse animation for loader
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Dots animation
    Animated.loop(
      Animated.timing(dotsAnim, {
        toValue: 3,
        duration: 1500,
        useNativeDriver: false,
      }),
    ).start();
  }, []);

  const animatedDots = dotsAnim.interpolate({
    inputRange: [0, 1, 2, 3],
    outputRange: ["", ".", "..", "..."],
  });

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <View style={styles.content}>
        {/* Animated searching icon */}
        <Animated.View
          style={[styles.loader, { transform: [{ scale: pulseAnim }] }]}
        >
          <Ionicons name="people-outline" size={80} color="#6B3A24" />
        </Animated.View>

        {/* Title */}
        <Text style={styles.title}>Finding Perfect Peer Match</Text>

        {/* Selected topics */}
        {selectedTopics.length > 0 && (
          <View style={styles.topicsContainer}>
            <Text style={styles.label}>Looking for peers matching:</Text>
            <View style={styles.topicsList}>
              {selectedTopics.map((topic, index) => (
                <View key={index} style={styles.topicChip}>
                  <Text style={styles.topicChipText}>{topic}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Style */}
        {conversationStyle && (
          <View style={styles.styleContainer}>
            <Text style={styles.label}>Style: {conversationStyle}</Text>
          </View>
        )}

        {/* Loading status */}
        <Animated.Text style={styles.loadingText}>
          Searching{animatedDots}
        </Animated.Text>

        {/* Progress */}
        <View style={styles.progressBar}>
          <View style={styles.progressFill} />
        </View>

        <Text style={styles.stats}>50+ peers checked</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5E6CB",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  loader: {
    marginBottom: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6B3A24",
    marginBottom: 30,
    textAlign: "center",
  },
  topicsContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  topicsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
    maxWidth: "100%",
  },
  topicChip: {
    backgroundColor: "#F7EBDD",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#D4B87A",
  },
  topicChipText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B3A24",
  },
  styleContainer: {
    backgroundColor: "#F7EBDD",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#D4B87A",
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6B3A24",
    marginBottom: 40,
  },
  progressBar: {
    width: width * 0.8,
    height: 8,
    backgroundColor: "#E2D1B0",
    borderRadius: 4,
    marginBottom: 20,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    width: "60%",
    backgroundColor: "#6B3A24",
    borderRadius: 4,
  },
  stats: {
    fontSize: 14,
    color: "#8B7355",
    fontWeight: "500",
  },
});
