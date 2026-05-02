import React, { useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  PanResponder,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TRACK_WIDTH = 280;

const moods = [
  { id: "calm", emoji: "\u{1F60A}", label: "Calm", color: "#5D8C62" },
  { id: "okay", emoji: "\u{1F642}", label: "Okay", color: "#8F8A4C" },
  { id: "low", emoji: "\u{1F614}", label: "Low", color: "#A37143" },
  { id: "sad", emoji: "\u{1F622}", label: "Sad", color: "#9A5C49" },
  { id: "anxious", emoji: "\u{1F630}", label: "Anxious", color: "#8C4F46" },
  { id: "angry", emoji: "\u{1F620}", label: "Angry", color: "#7A3C32" },
];

const severityLabels = ["Very Mild", "Mild", "Moderate", "Strong", "Intense"];

export default function MoodCheckScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const initialMoodId = route.params?.moodId;
  const initialMood = moods.find((mood) => mood.id === initialMoodId) || moods[0];
  const [selectedMood, setSelectedMood] = useState(initialMood);
  const [severity, setSeverity] = useState(2);
  const [trackWidth, setTrackWidth] = useState(TRACK_WIDTH);

  const knobOffset = useMemo(() => {
    if (trackWidth <= 24) {
      return 0;
    }
    return (severity / 4) * (trackWidth - 24);
  }, [severity, trackWidth]);

  const updateSeverityFromPosition = (x) => {
    if (trackWidth <= 0) {
      return;
    }

    const clampedX = Math.max(0, Math.min(x, trackWidth));
    const nextSeverity = Math.round((clampedX / trackWidth) * 4);
    setSeverity(nextSeverity);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (event) => {
        updateSeverityFromPosition(event.nativeEvent.locationX);
      },
      onPanResponderMove: (event) => {
        updateSeverityFromPosition(event.nativeEvent.locationX);
      },
    }),
  ).current;

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={22} color="#3D2B1F" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mood Check</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.heroCard}>
          <Text style={styles.eyebrow}>Daily Check-In</Text>
          <Text style={styles.heroTitle}>How are you feeling today?</Text>
          <Text style={styles.heroText}>
            Pick the mood that fits best and use the slider to show how strong
            it feels right now.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose your mood</Text>
          <View style={styles.moodGrid}>
            {moods.map((mood) => {
              const selected = selectedMood.id === mood.id;
              return (
                <TouchableOpacity
                  key={mood.id}
                  style={[
                    styles.moodCard,
                    selected && {
                      borderColor: mood.color,
                      backgroundColor: "#FFF7EA",
                    },
                  ]}
                  onPress={() => setSelectedMood(mood)}
                >
                  <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                  <Text
                    style={[
                      styles.moodLabel,
                      selected && { color: mood.color },
                    ]}
                  >
                    {mood.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How serious is it?</Text>
          <View style={styles.sliderCard}>
            <View style={styles.sliderHeader}>
              <Text style={styles.sliderMood}>
                {selectedMood.emoji} {selectedMood.label}
              </Text>
              <Text style={[styles.sliderStatus, { color: selectedMood.color }]}> 
                {severityLabels[severity]}
              </Text>
            </View>

            <View
              style={styles.trackWrap}
              onLayout={(event) =>
                setTrackWidth(event.nativeEvent.layout.width || TRACK_WIDTH)
              }
              {...panResponder.panHandlers}
            >
              <View style={styles.trackBackground} />
              <View
                style={[
                  styles.trackFill,
                  { width: knobOffset + 24, backgroundColor: selectedMood.color },
                ]}
              />
              <View
                style={[
                  styles.trackKnob,
                  {
                    left: knobOffset,
                    borderColor: selectedMood.color,
                  },
                ]}
              />
            </View>

            <View style={styles.sliderScale}>
              {severityLabels.map((label, index) => (
                <TouchableOpacity
                  key={label}
                  style={styles.scaleStep}
                  onPress={() => setSeverity(index)}
                >
                  <View
                    style={[
                      styles.scaleDot,
                      index <= severity && { backgroundColor: selectedMood.color },
                    ]}
                  />
                  <Text style={styles.scaleText}>{label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Today's Mood Summary</Text>
          <Text style={styles.summaryText}>
            You're feeling <Text style={styles.summaryStrong}>{selectedMood.label}</Text> at a{" "}
            <Text style={styles.summaryStrong}>{severityLabels[severity]}</Text>{" "}
            level.
          </Text>
          <Text style={styles.summaryHint}>
            Tracking this regularly can help you notice patterns and understand
            what support you need.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={() =>
            navigation.navigate("MoodCheckSuccess", {
              moodLabel: selectedMood.label,
              moodEmoji: selectedMood.emoji,
              severityLabel: severityLabels[severity],
            })
          }
        >
          <Text style={styles.saveButtonText}>Save Check-In</Text>
        </TouchableOpacity>
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
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 28,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F7EBDD",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "800",
    color: "#3D2B1F",
  },
  headerSpacer: {
    width: 40,
  },
  heroCard: {
    backgroundColor: "#FFF8EE",
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ECD8C1",
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: "700",
    color: "#7A4B2F",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#4A2818",
    marginBottom: 8,
  },
  heroText: {
    fontSize: 14,
    lineHeight: 21,
    color: "#6F5B48",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#4A2818",
    marginBottom: 12,
  },
  moodGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  moodCard: {
    width: "31%",
    minHeight: 90,
    backgroundColor: "#F7EBDD",
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  moodEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  moodLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#3D2B1F",
  },
  sliderCard: {
    backgroundColor: "#FFF8EE",
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "#ECD8C1",
  },
  sliderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  sliderMood: {
    fontSize: 18,
    fontWeight: "800",
    color: "#4A2818",
  },
  sliderStatus: {
    fontSize: 13,
    fontWeight: "700",
  },
  trackWrap: {
    height: 34,
    justifyContent: "center",
    marginBottom: 18,
  },
  trackBackground: {
    height: 10,
    borderRadius: 999,
    backgroundColor: "#E5D8BF",
  },
  trackFill: {
    position: "absolute",
    left: 0,
    height: 10,
    borderRadius: 999,
  },
  trackKnob: {
    position: "absolute",
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FFF",
    borderWidth: 3,
    top: 5,
  },
  sliderScale: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  scaleStep: {
    flex: 1,
    alignItems: "center",
  },
  scaleDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#D4C3A2",
    marginBottom: 6,
  },
  scaleText: {
    fontSize: 11,
    color: "#6F5B48",
    textAlign: "center",
  },
  summaryCard: {
    backgroundColor: "#F7EBDD",
    borderRadius: 22,
    padding: 18,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#4A2818",
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#3D2B1F",
    marginBottom: 8,
  },
  summaryStrong: {
    fontWeight: "800",
  },
  summaryHint: {
    fontSize: 13,
    lineHeight: 19,
    color: "#6F5B48",
  },
  saveButton: {
    backgroundColor: "#3D2B1F",
    borderRadius: 28,
    paddingVertical: 16,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#FFF8EC",
    fontSize: 16,
    fontWeight: "800",
  },
});
