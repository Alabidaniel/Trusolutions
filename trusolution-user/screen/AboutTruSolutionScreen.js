import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AboutTruSolutionScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color="#3D2B1F" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>About TruSolution</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.heroCard}>
          <Image
            source={require("../assets/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.appName}>TruSolution</Text>
          <Text style={styles.version}>Version 1.0.0</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Our Mission</Text>
          <Text style={styles.infoText}>
            TruSolution helps people feel supported through peer conversations,
            guided reflection, community sharing, and therapist connection.
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>What This App Includes</Text>
          <Text style={styles.infoText}>
            Mood check-ins, community posts, peer chat, therapist discovery,
            and supportive wellness tools designed to feel calm and accessible.
          </Text>
        </View>
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
  heroCard: { backgroundColor: "#FFF8EE", borderRadius: 24, padding: 24, alignItems: "center", marginBottom: 16 },
  logo: { width: 88, height: 88, marginBottom: 4 },
  appName: { fontSize: 24, fontWeight: "800", color: "#4A2818", marginTop: 10 },
  version: { fontSize: 13, color: "#7B6753", marginTop: 6 },
  infoCard: { backgroundColor: "#F7EBDD", borderRadius: 18, padding: 16, marginBottom: 12 },
  infoTitle: { fontSize: 16, fontWeight: "800", color: "#4A2818", marginBottom: 6 },
  infoText: { fontSize: 14, lineHeight: 21, color: "#6F5B48" },
});
