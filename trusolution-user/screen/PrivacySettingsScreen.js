import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PrivacySettingsScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [anonymousMode, setAnonymousMode] = useState(true);
  const [profileVisible, setProfileVisible] = useState(false);
  const [dataSharing, setDataSharing] = useState(false);

  const rows = [
    {
      title: "Default Anonymous Posting",
      subtitle: "Keep your shared experiences anonymous by default.",
      value: anonymousMode,
      onChange: setAnonymousMode,
    },
    {
      title: "Profile Visible in Community",
      subtitle: "Let other people in the app discover your public profile.",
      value: profileVisible,
      onChange: setProfileVisible,
    },
    {
      title: "Wellness Insights Sharing",
      subtitle: "Share anonymous usage patterns to improve support tools.",
      value: dataSharing,
      onChange: setDataSharing,
    },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color="#3D2B1F" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Privacy</Text>
          <View style={styles.headerSpacer} />
        </View>

        <Text style={styles.intro}>
          Choose how visible you want to be and how your information is used inside the app.
        </Text>

        {rows.map((row) => (
          <View key={row.title} style={styles.rowCard}>
            <View style={styles.rowText}>
              <Text style={styles.rowTitle}>{row.title}</Text>
              <Text style={styles.rowSubtitle}>{row.subtitle}</Text>
            </View>
            <Switch
              value={row.value}
              onValueChange={row.onChange}
              trackColor={{ false: "#E3C9AA", true: "#A06A46" }}
              thumbColor={row.value ? "#3D2B1F" : "#FFF8EC"}
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
  intro: { fontSize: 14, lineHeight: 21, color: "#6F5B48", marginBottom: 16 },
  rowCard: {
    backgroundColor: "#FFF8EE", borderRadius: 20, padding: 16, marginBottom: 12,
    flexDirection: "row", alignItems: "center",
  },
  rowText: { flex: 1, paddingRight: 12 },
  rowTitle: { fontSize: 16, fontWeight: "800", color: "#4A2818", marginBottom: 6 },
  rowSubtitle: { fontSize: 13, lineHeight: 18, color: "#7B6753" },
});
