import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function MoodCheckSuccessScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const moodLabel = route.params?.moodLabel || "Calm";
  const moodEmoji = route.params?.moodEmoji || "\u{1F60A}";
  const severityLabel = route.params?.severityLabel || "Moderate";

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 20 },
      ]}
    >
      <View style={styles.card}>
        <View style={styles.iconWrap}>
          <Ionicons name="checkmark" size={36} color="#256D3C" />
        </View>
        <Text style={styles.title}>Mood Check Successful</Text>
        <Text style={styles.summary}>
          Saved: {moodEmoji} {moodLabel} ({severityLabel})
        </Text>
        <Text style={styles.message}>
          Great job checking in. Every entry helps you understand your emotional
          patterns better.
        </Text>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate("MainTabs", { screen: "Home" })}
          activeOpacity={0.9}
        >
          <Text style={styles.primaryButtonText}>Go Back Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate("MoodProgress")}
          activeOpacity={0.9}
        >
          <Text style={styles.secondaryButtonText}>View Progress</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5E6CB",
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#FFF8EE",
    borderRadius: 26,
    padding: 24,
    borderWidth: 1,
    borderColor: "#ECD8C1",
    alignItems: "center",
  },
  iconWrap: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: "#E7F4E1",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 27,
    fontWeight: "800",
    color: "#3D2B1F",
    textAlign: "center",
    marginBottom: 10,
  },
  summary: {
    fontSize: 14,
    color: "#7A4B2F",
    fontWeight: "700",
    marginBottom: 10,
  },
  message: {
    fontSize: 14,
    lineHeight: 21,
    color: "#8A6A57",
    textAlign: "center",
    marginBottom: 22,
  },
  primaryButton: {
    width: "100%",
    backgroundColor: "#7A4B2F",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 10,
  },
  primaryButtonText: {
    color: "#FFF9F3",
    fontSize: 15,
    fontWeight: "800",
  },
  secondaryButton: {
    width: "100%",
    backgroundColor: "#F9F1E5",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E4C9A8",
  },
  secondaryButtonText: {
    color: "#7A4B2F",
    fontSize: 15,
    fontWeight: "800",
  },
});
