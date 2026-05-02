import React, { useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const weeklyData = [
  { day: "Mon", value: 2.1 },
  { day: "Tue", value: 2.8 },
  { day: "Wed", value: 1.7 },
  { day: "Thu", value: 3.2 },
  { day: "Fri", value: 2.9 },
  { day: "Sat", value: 2.4 },
  { day: "Sun", value: 3.4 },
];

const recentEntries = [
  { mood: "Calm", emoji: "\u{1F60A}", level: "Mild", score: 2, date: "Today" },
  { mood: "Okay", emoji: "\u{1F642}", level: "Moderate", score: 3, date: "Yesterday" },
  { mood: "Low", emoji: "\u{1F614}", level: "Strong", score: 4, date: "2 days ago" },
  { mood: "Calm", emoji: "\u{1F60A}", level: "Mild", score: 2, date: "3 days ago" },
];

const scoreToLabel = (score) => {
  if (score <= 1.6) return "Stable";
  if (score <= 2.6) return "Balanced";
  if (score <= 3.4) return "Elevated";
  return "High stress";
};

export default function MoodProgressScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const analytics = useMemo(() => {
    const scores = weeklyData.map((d) => d.value);
    const avg = scores.reduce((sum, item) => sum + item, 0) / scores.length;
    const max = Math.max(...scores);
    const min = Math.min(...scores);
    const last = scores[scores.length - 1];
    const first = scores[0];
    const delta = last - first;
    const checkInRate = Math.round((recentEntries.length / 7) * 100);
    const stability = Math.max(0, Math.round(100 - (max - min) * 20));

    return {
      avg,
      max,
      min,
      delta,
      checkInRate,
      stability,
      stateLabel: scoreToLabel(avg),
    };
  }, []);

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom + 10 },
      ]}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={20} color="#3D2B1F" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mood Progress</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.heroCard}>
          <Text style={styles.heroKicker}>Behavioral Analytics</Text>
          <Text style={styles.heroTitle}>Emotional Trend Dashboard</Text>
          <Text style={styles.heroText}>
            Your week is currently rated as {analytics.stateLabel.toLowerCase()} based on mood intensity and check-in consistency.
          </Text>
          <View style={styles.heroInlineStats}>
            <View style={styles.inlineStatPill}>
              <Text style={styles.inlineStatLabel}>Avg Index</Text>
              <Text style={styles.inlineStatValue}>{analytics.avg.toFixed(1)}/5</Text>
            </View>
            <View style={styles.inlineStatPill}>
              <Text style={styles.inlineStatLabel}>Stability</Text>
              <Text style={styles.inlineStatValue}>{analytics.stability}%</Text>
            </View>
          </View>
        </View>

        <View style={styles.kpiRow}>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiTitle}>Check-in rate</Text>
            <Text style={styles.kpiValue}>{analytics.checkInRate}%</Text>
            <Text style={styles.kpiSub}>Last 7 days</Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiTitle}>Weekly delta</Text>
            <Text style={styles.kpiValue}>{analytics.delta >= 0 ? "+" : ""}{analytics.delta.toFixed(1)}</Text>
            <Text style={styles.kpiSub}>{analytics.delta >= 0 ? "Upward stress" : "Downward stress"}</Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Technical trend (0-5)</Text>
          <View style={styles.axisRow}>
            <View style={styles.yAxis}>
              {[5, 4, 3, 2, 1].map((mark) => (
                <Text key={mark} style={styles.axisLabel}>{mark}</Text>
              ))}
            </View>

            <View style={styles.chartArea}>
              {[5, 4, 3, 2, 1].map((mark) => (
                <View key={mark} style={styles.gridLine} />
              ))}
              <View style={styles.barRow}>
                {weeklyData.map((item) => (
                  <View key={item.day} style={styles.barWrap}>
                    <View style={[styles.bar, { height: 16 + item.value * 24 }]} />
                    <Text style={styles.barDay}>{item.day}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.legendRow}>
            <Text style={styles.legendText}>Min: {analytics.min.toFixed(1)}</Text>
            <Text style={styles.legendText}>Max: {analytics.max.toFixed(1)}</Text>
            <Text style={styles.legendText}>Avg: {analytics.avg.toFixed(1)}</Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Recent check-ins</Text>
          {recentEntries.map((entry) => (
            <View key={`${entry.date}-${entry.mood}`} style={styles.entryRow}>
              <Text style={styles.entryMood}>
                {entry.emoji} {entry.mood}
              </Text>
              <Text style={styles.entryLevel}>{entry.level}</Text>
              <Text style={styles.entryScore}>{entry.score.toFixed(1)}</Text>
              <Text style={styles.entryDate}>{entry.date}</Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Professional insight</Text>
          <Text style={styles.insightText}>
            Pattern indicates moderate emotional variability with periodic stress peaks. Recommended: maintain daily check-ins and pair high-score days with calming interventions.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => navigation.navigate("MainTabs", { screen: "Home" })}
        >
          <Text style={styles.homeButtonText}>Back to Home</Text>
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
    paddingTop: 10,
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF8EE",
    borderWidth: 1,
    borderColor: "#ECD8C1",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 22,
    fontWeight: "800",
    color: "#3D2B1F",
  },
  headerSpacer: {
    width: 40,
  },
  heroCard: {
    backgroundColor: "#7A4B2F",
    borderRadius: 24,
    padding: 18,
    marginBottom: 14,
  },
  heroKicker: {
    color: "#E7C9B7",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.7,
    textTransform: "uppercase",
    marginBottom: 7,
  },
  heroTitle: {
    color: "#FFF9F3",
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 8,
  },
  heroText: {
    color: "#F7E2D6",
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 14,
  },
  heroInlineStats: {
    flexDirection: "row",
    gap: 10,
  },
  inlineStatPill: {
    flex: 1,
    backgroundColor: "#8B5A3C",
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  inlineStatLabel: {
    color: "#E7C9B7",
    fontSize: 11,
    marginBottom: 3,
  },
  inlineStatValue: {
    color: "#FFF9F3",
    fontSize: 15,
    fontWeight: "800",
  },
  kpiRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: "#FFF8EE",
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: "#ECD8C1",
  },
  kpiTitle: {
    fontSize: 12,
    color: "#8A6A57",
    marginBottom: 6,
  },
  kpiValue: {
    fontSize: 24,
    fontWeight: "800",
    color: "#3D2B1F",
    marginBottom: 2,
  },
  kpiSub: {
    fontSize: 12,
    color: "#7A4B2F",
    fontWeight: "700",
  },
  sectionCard: {
    backgroundColor: "#FFF8EE",
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#ECD8C1",
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#3D2B1F",
    marginBottom: 12,
  },
  axisRow: {
    flexDirection: "row",
  },
  yAxis: {
    width: 22,
    justifyContent: "space-between",
    paddingBottom: 22,
    paddingTop: 4,
  },
  axisLabel: {
    fontSize: 10,
    color: "#8A6A57",
    textAlign: "center",
  },
  chartArea: {
    flex: 1,
    position: "relative",
    paddingHorizontal: 4,
  },
  gridLine: {
    position: "relative",
    height: 1,
    backgroundColor: "#EFE0D0",
    marginBottom: 24,
  },
  barRow: {
    position: "absolute",
    left: 4,
    right: 4,
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  barWrap: {
    width: 32,
    alignItems: "center",
  },
  bar: {
    width: 16,
    borderRadius: 8,
    backgroundColor: "#7A4B2F",
    marginBottom: 7,
  },
  barDay: {
    fontSize: 11,
    color: "#8A6A57",
    fontWeight: "700",
  },
  legendRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  legendText: {
    fontSize: 11,
    color: "#8A6A57",
    fontWeight: "700",
  },
  entryRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F0E0CF",
  },
  entryMood: {
    flex: 1.3,
    fontSize: 14,
    fontWeight: "700",
    color: "#3D2B1F",
  },
  entryLevel: {
    flex: 1,
    fontSize: 12,
    color: "#7A4B2F",
    fontWeight: "700",
    textAlign: "center",
  },
  entryScore: {
    flex: 0.7,
    fontSize: 12,
    color: "#3D2B1F",
    fontWeight: "800",
    textAlign: "center",
  },
  entryDate: {
    flex: 1,
    fontSize: 12,
    color: "#8A6A57",
    textAlign: "right",
  },
  insightText: {
    fontSize: 13,
    lineHeight: 20,
    color: "#6E5444",
  },
  homeButton: {
    backgroundColor: "#7A4B2F",
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 4,
  },
  homeButtonText: {
    color: "#FFF9F3",
    fontSize: 15,
    fontWeight: "800",
  },
});
