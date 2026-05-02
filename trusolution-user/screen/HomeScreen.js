import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  BackHandler,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useAppointments } from "../context/AppointmentContext";

const moods = [
  { id: "calm", emoji: "\u{1F60A}" },
  { id: "okay", emoji: "\u{1F642}" },
  { id: "low", emoji: "\u{1F614}" },
  { id: "sad", emoji: "\u{1F622}" },
  { id: "anxious", emoji: "\u{1F630}" },
  { id: "angry", emoji: "\u{1F620}" },
];

const quickActions = [
  {
    title: "Share Experience",
    subtitle: "Express what is on your mind",
    icon: "chatbubble-ellipses",
    action: "ShareExperience",
  },
  {
    title: "Chat with Peer",
    subtitle: "Connect with someone who relates",
    icon: "people",
    action: "ChatWithPeer",
  },
  {
    title: "Therapist",
    subtitle: "Find licensed support quickly",
    icon: "medkit",
    action: "Therapist",
  },
  {
    title: "Mood Check",
    subtitle: "Track how you feel today",
    icon: "calendar",
    action: "MoodCheck",
  },
];

export default function HomeScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { upcomingAppointment } = useAppointments();
  const [selectedMood, setSelectedMood] = useState("calm");

  useFocusEffect(
    React.useCallback(() => {
      if (Platform.OS !== "android") {
        return undefined;
      }

      const onBackPress = () => {
        BackHandler.exitApp();
        return true;
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress,
      );

      return () => subscription.remove();
    }, []),
  );

  const openMoodCheck = (moodId = selectedMood) => {
    navigation.navigate("MoodCheck", { moodId });
  };

  const openQuickAction = (action) => {
    if (action === "MoodCheck") {
      openMoodCheck();
      return;
    }

    navigation.navigate(action);
  };

  return (
    <View style={[styles.fullContainer, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: insets.bottom + 92 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good Morning, User</Text>
            <Text style={styles.subText}>Take a gentle check-in before your day gets busy.</Text>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate("Settings")}
            accessibilityRole="button"
            accessibilityLabel="Open settings"
            style={styles.headerButton}
          >
            <Ionicons name="person" size={22} color="#3D2B1F" />
          </TouchableOpacity>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View style={styles.heroBadge}>
              <Ionicons name="sparkles" size={14} color="#256D3C" />
              <Text style={styles.heroBadgeText}>Daily wellness</Text>
            </View>
            <TouchableOpacity style={styles.heroMiniButton} onPress={() => openMoodCheck()}>
              <Text style={styles.heroMiniButtonText}>Check now</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.heroTitle}>How are you feeling right now?</Text>
          <Text style={styles.heroSubtitle}>
            Choose a mood and continue with the support option that matches your energy.
          </Text>
          <View style={styles.heroStats}>
            <View style={styles.heroStatCard}>
              <Text style={styles.heroStatValue}>5 days</Text>
              <Text style={styles.heroStatLabel}>Mood streak</Text>
            </View>
            <View style={styles.heroStatCard}>
              <Text style={styles.heroStatValue}>3</Text>
              <Text style={styles.heroStatLabel}>Recent chats</Text>
            </View>
            <View style={styles.heroStatCard}>
              <Text style={styles.heroStatValue}>Today</Text>
              <Text style={styles.heroStatLabel}>Last check-in</Text>
            </View>
          </View>
        </View>

        <View style={styles.cardRow}>
          {quickActions.map((card) => (
            <TouchableOpacity
              key={card.title}
              style={styles.card}
              onPress={() => openQuickAction(card.action)}
              activeOpacity={0.92}
            >
              <View style={styles.cardIconWrap}>
                <Ionicons name={card.icon} size={20} color="#FFF9F3" />
              </View>
              <Text style={styles.cardText}>{card.title}</Text>
              <Text style={styles.cardSubtext}>{card.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.moodBox}>
          <View style={styles.moodHeader}>
            <Text style={styles.moodTitle}>Quick mood check</Text>
            <Text style={styles.moodHint}>Tap any mood to open full check-in</Text>
          </View>
          <View style={styles.moodRow}>
            {moods.map((mood) => (
              <TouchableOpacity
                key={mood.id}
                onPress={() => {
                  setSelectedMood(mood.id);
                  openMoodCheck(mood.id);
                }}
                style={styles.moodButton}
              >
                <Text
                  style={[
                    styles.emoji,
                    {
                      opacity: selectedMood === mood.id ? 1 : 0.45,
                      transform: [{ scale: selectedMood === mood.id ? 1.14 : 1 }],
                    },
                  ]}
                >
                  {mood.emoji}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.checkBtn} onPress={() => openMoodCheck()}>
            <Text style={styles.checkText}>Open Mood Check</Text>
            <Ionicons name="arrow-forward" size={16} color="#FFF9F3" />
          </TouchableOpacity>
        </View>

        <View style={styles.encourageBox}>
          <View style={styles.encourageHeader}>
            <Text style={styles.encourageTitle}>Daily Encouragement</Text>
            <Ionicons name="refresh" size={17} color="#FFF9F3" />
          </View>

          <Text style={styles.quote}>
            "You are stronger than you know.{"\n"}
            Take one step at a time"
          </Text>
        </View>

        <View style={styles.therapistBox}>
          <Text style={styles.helpTitle}>Need Professional Help?</Text>

          <Text style={styles.helpText}>
            Our licensed therapists are here to support you.
          </Text>

          <TouchableOpacity
            style={styles.findBtn}
            onPress={() => navigation.navigate("Therapist")}
          >
            <Text style={styles.findText}>Find a Therapist</Text>
          </TouchableOpacity>
        </View>

        {upcomingAppointment ? (
          <View style={styles.upcomingCard}>
            <View style={styles.upcomingHeader}>
              <View style={styles.upcomingBadge}>
                <Ionicons name="calendar" size={14} color="#256D3C" />
                <Text style={styles.upcomingBadgeText}>Upcoming session</Text>
              </View>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("AppointmentDetails", {
                    appointmentId: upcomingAppointment.id,
                  })
                }
              >
                <Text style={styles.upcomingLink}>Details</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.upcomingName}>
              {upcomingAppointment.therapist.name}
            </Text>
            <Text style={styles.upcomingMeta}>
              {upcomingAppointment.date} at {upcomingAppointment.time}
            </Text>
            <View style={styles.upcomingActionsRow}>
              <TouchableOpacity
                style={styles.upcomingPrimaryButton}
                onPress={() =>
                  navigation.navigate("PeerChat", {
                    peerName: upcomingAppointment.therapist.name,
                    conversationStyle: "Professional support",
                    chatType: "therapist",
                  })
                }
              >
                <Text style={styles.upcomingPrimaryButtonText}>
                  Message therapist
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.upcomingSecondaryButton}
                onPress={() =>
                  navigation.navigate("AppointmentDetails", {
                    appointmentId: upcomingAppointment.id,
                  })
                }
              >
                <Text style={styles.upcomingSecondaryButtonText}>
                  Manage
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}

        <Text style={styles.sectionTitle}>Activity Summary</Text>

        <View style={styles.summaryRow}>
          <SummaryCard title="Mood Streak" value="5 Days" />
          <SummaryCard title="Recent Chat" value="3" />
          <SummaryCard title="Last Journal" value="Yesterday" />
        </View>
      </ScrollView>
    </View>
  );
}

const SummaryCard = ({ title, value }) => (
  <View style={styles.summaryCard}>
    <Text style={styles.summaryTitle}>{title}</Text>
    <Text style={styles.summaryValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
    backgroundColor: "#F5E6CB",
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  greeting: {
    fontSize: 26,
    fontWeight: "800",
    color: "#3D2B1F",
    marginBottom: 4,
  },
  subText: {
    fontSize: 13,
    color: "#8A6A57",
    maxWidth: 260,
    lineHeight: 19,
  },
  headerButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#FFF8EE",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ECD8C1",
  },
  heroCard: {
    backgroundColor: "#7A4B2F",
    borderRadius: 28,
    padding: 20,
    marginBottom: 16,
  },
  heroTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#E7F4E1",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
  },
  heroBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#256D3C",
  },
  heroMiniButton: {
    backgroundColor: "rgba(255, 249, 243, 0.18)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  heroMiniButtonText: {
    color: "#FFF9F3",
    fontSize: 12,
    fontWeight: "700",
  },
  heroTitle: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "800",
    color: "#FFF9F3",
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: "#F7E2D6",
    marginBottom: 16,
  },
  heroStats: {
    flexDirection: "row",
    gap: 10,
  },
  heroStatCard: {
    flex: 1,
    backgroundColor: "#8B5A3C",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  heroStatValue: {
    color: "#FFF9F3",
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 4,
  },
  heroStatLabel: {
    color: "#E7C9B7",
    fontSize: 11,
  },
  cardRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  card: {
    backgroundColor: "#FFF8EE",
    width: "48.5%",
    padding: 14,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ECD8C1",
  },
  cardIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#7A4B2F",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  cardText: {
    color: "#3D2B1F",
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 4,
  },
  cardSubtext: {
    color: "#8A6A57",
    fontSize: 12,
    lineHeight: 17,
  },
  moodBox: {
    backgroundColor: "#F9F1E5",
    padding: 16,
    borderRadius: 20,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#ECD8C1",
  },
  moodHeader: {
    marginBottom: 12,
  },
  moodTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#3D2B1F",
    marginBottom: 2,
  },
  moodHint: {
    fontSize: 12,
    color: "#8A6A57",
  },
  moodRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  moodButton: {
    paddingHorizontal: 3,
  },
  emoji: {
    fontSize: 30,
  },
  checkBtn: {
    backgroundColor: "#3D2B1F",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  checkText: {
    color: "#FFF9F3",
    fontWeight: "800",
    fontSize: 13,
  },
  encourageBox: {
    backgroundColor: "#7A4B2F",
    padding: 18,
    borderRadius: 20,
    marginBottom: 14,
  },
  encourageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  encourageTitle: {
    color: "#FFF9F3",
    fontWeight: "800",
    fontSize: 15,
  },
  quote: {
    color: "#F7E2D6",
    textAlign: "center",
    marginTop: 12,
    fontSize: 14,
    lineHeight: 21,
  },
  therapistBox: {
    backgroundColor: "#FFF8EE",
    padding: 18,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#ECD8C1",
  },
  helpTitle: {
    fontWeight: "800",
    fontSize: 17,
    color: "#3D2B1F",
  },
  helpText: {
    fontSize: 13,
    marginTop: 8,
    marginBottom: 10,
    lineHeight: 19,
    textAlign: "center",
    color: "#8A6A57",
    maxWidth: 260,
  },
  findBtn: {
    backgroundColor: "#7A4B2F",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 14,
    marginTop: 2,
  },
  findText: {
    color: "#FFF9F3",
    fontWeight: "800",
    fontSize: 13,
  },
  upcomingCard: {
    backgroundColor: "#FFF8EE",
    padding: 16,
    borderRadius: 20,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#ECD8C1",
  },
  upcomingHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  upcomingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#E7F4E1",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  upcomingBadgeText: {
    color: "#256D3C",
    fontSize: 12,
    fontWeight: "700",
  },
  upcomingLink: {
    fontSize: 12,
    fontWeight: "800",
    color: "#7A4B2F",
  },
  upcomingName: {
    fontSize: 17,
    fontWeight: "800",
    color: "#3D2B1F",
    marginBottom: 4,
  },
  upcomingMeta: {
    fontSize: 13,
    color: "#8A6A57",
    marginBottom: 12,
  },
  upcomingActionsRow: {
    flexDirection: "row",
    gap: 8,
  },
  upcomingPrimaryButton: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: "#7A4B2F",
    paddingVertical: 11,
    alignItems: "center",
  },
  upcomingPrimaryButtonText: {
    color: "#FFF9F3",
    fontSize: 12,
    fontWeight: "800",
  },
  upcomingSecondaryButton: {
    borderRadius: 12,
    backgroundColor: "#F9F1E5",
    borderWidth: 1,
    borderColor: "#E4C9A8",
    paddingHorizontal: 14,
    paddingVertical: 11,
    alignItems: "center",
  },
  upcomingSecondaryButtonText: {
    color: "#7A4B2F",
    fontSize: 12,
    fontWeight: "800",
  },
  sectionTitle: {
    fontWeight: "800",
    marginBottom: 10,
    fontSize: 19,
    color: "#3D2B1F",
    marginTop: 2,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryCard: {
    backgroundColor: "#F9F1E5",
    padding: 12,
    borderRadius: 14,
    width: "31%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ECD8C1",
  },
  summaryTitle: {
    fontSize: 11,
    color: "#8A6A57",
    textAlign: "center",
  },
  summaryValue: {
    fontWeight: "800",
    marginTop: 6,
    color: "#3D2B1F",
    fontSize: 13,
    textAlign: "center",
  },
});
