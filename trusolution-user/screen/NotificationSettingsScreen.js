import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function NotificationSettingsScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [pushEnabled, setPushEnabled] = useState(true);
  const [messageAlerts, setMessageAlerts] = useState(true);
  const [communityAlerts, setCommunityAlerts] = useState(true);
  const [reminders, setReminders] = useState(false);

  const options = [
    ["Push Notifications", "Receive notifications on your device.", pushEnabled, setPushEnabled],
    ["New Messages", "Get alerted when peers or therapists reply.", messageAlerts, setMessageAlerts],
    ["Community Activity", "Know when someone reacts or comments on your post.", communityAlerts, setCommunityAlerts],
    ["Mood Check Reminders", "Daily reminders to check in with yourself.", reminders, setReminders],
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color="#3D2B1F" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
          <View style={styles.headerSpacer} />
        </View>

        {options.map(([title, subtitle, value, onChange]) => (
          <View key={title} style={styles.card}>
            <View style={styles.textWrap}>
              <Text style={styles.cardTitle}>{title}</Text>
              <Text style={styles.cardSubtitle}>{subtitle}</Text>
            </View>
            <Switch
              value={value}
              onValueChange={onChange}
              trackColor={{ false: "#E3C9AA", true: "#A06A46" }}
              thumbColor={value ? "#3D2B1F" : "#FFF8EC"}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5E6CB" },
  content: { padding: 18, paddingBottom: 28 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  backButton: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: "#F7EBDD",
    alignItems: "center", justifyContent: "center",
  },
  headerTitle: { flex: 1, textAlign: "center", fontSize: 22, fontWeight: "800", color: "#3D2B1F" },
  headerSpacer: { width: 40 },
  card: {
    backgroundColor: "#FFF8EE", borderRadius: 20, padding: 16, marginBottom: 12,
    flexDirection: "row", alignItems: "center",
  },
  textWrap: { flex: 1, paddingRight: 12 },
  cardTitle: { fontSize: 16, fontWeight: "800", color: "#4A2818", marginBottom: 6 },
  cardSubtitle: { fontSize: 13, lineHeight: 18, color: "#7B6753" },
});
