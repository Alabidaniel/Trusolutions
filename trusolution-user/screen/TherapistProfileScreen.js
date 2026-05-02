import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const TherapistProfileScreen = ({ route }) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const therapist = route.params?.therapist || {
    name: "Dr. Sarah Johnson",
    specialty: "Anxiety & Stress",
    rating: 4.9,
    sessions: 150,
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backIcon}
          >
            <Ionicons name="arrow-back" size={24} color="#7A4B2F" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Therapist Profile</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* PROFILE CARD */}
        <View style={styles.card}>
          <View style={styles.avatar} />
          <Text style={styles.name}>{therapist.name}</Text>
          <Text style={styles.specialty}>{therapist.specialty}</Text>
          <Text style={styles.exp}>{therapist.sessions} Sessions</Text>

          {/* STATUS */}
          <View style={styles.statusRow}>
            <View style={styles.dot} />
            <Text style={styles.statusText}>Available Now</Text>
          </View>

          {/* MAIN BUTTONS - Horizontal */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={() =>
                navigation.navigate("TherapistBooking", { therapist })
              }
            >
              <Ionicons name="calendar" size={20} color="#FFF8EE" />
              <Text style={styles.primaryButtonText}>Book Session</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={() =>
                navigation.navigate("PeerChat", {
                  peerName: therapist.name,
                  conversationStyle: "Professional support",
                  chatType: "therapist",
                })
              }
            >
              <Ionicons name="chatbubble" size={20} color="#7A4B2F" />
              <Text style={styles.secondaryButtonText}>Message</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* RATING */}
        <View style={styles.ratingSection}>
          <View style={styles.ratingRow}>
            <Text style={styles.rating}>{therapist.rating} {"\u2605"}</Text>
            <Text style={styles.reviewCount}>124 reviews</Text>
          </View>
        </View>

        {/* SPECIALTIES */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Specialties</Text>
          <View style={styles.tagsRow}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>Anxiety</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>Stress</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>CBT</Text>
            </View>
          </View>
        </View>

        {/* ABOUT */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.aboutText}>
            Specializes in CBT and mindfulness for anxiety management. Creates a
            safe space with practical tools for long-term mental health
            improvement. 12+ years experience.
          </Text>
        </View>

        {/* CREDENTIALS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Credentials</Text>
          <View style={styles.credentialItem}>
            <Text style={styles.credentialText}>{"\u2022"} PhD Clinical Psychology</Text>
          </View>
          <View style={styles.credentialItem}>
            <Text style={styles.credentialText}>{"\u2022"} Licensed LMHC #12345</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

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
    borderBottomColor: "#D4C8A0",
  },
  backIcon: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#3D2B1F",
    flex: 1,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#FFF8EE",
    margin: 20,
    marginTop: 10,
    borderRadius: 24,
    padding: 30,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F5E6CB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#F7EBDD",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  name: {
    fontSize: 22,
    fontWeight: "800",
    color: "#3D2B1F",
    marginBottom: 4,
    textAlign: "center",
  },
  specialty: {
    fontSize: 16,
    color: "#7A4B2F",
    fontWeight: "600",
    marginBottom: 8,
  },
  exp: {
    fontSize: 14,
    color: "#7A4B2F",
    fontWeight: "500",
    marginBottom: 20,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#4CAF50",
    marginRight: 12,
  },
  statusText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4CAF50",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
    marginTop: 8,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButton: {
    backgroundColor: "#7A4B2F",
  },
  secondaryButton: {
    backgroundColor: "#F7EBDD",
    borderWidth: 2,
    borderColor: "#7A4B2F",
  },
  primaryButtonText: {
    color: "#FFF8EE",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryButtonText: {
    color: "#7A4B2F",
    fontSize: 16,
    fontWeight: "700",
  },
  ratingSection: {
    marginHorizontal: 20,
    marginVertical: 12,
    alignItems: "center",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  rating: {
    fontSize: 24,
    fontWeight: "800",
    color: "#7A4B2F",
  },
  reviewCount: {
    fontSize: 14,
    color: "#7A4B2F",
    fontWeight: "500",
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#3D2B1F",
    marginBottom: 16,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  tag: {
    backgroundColor: "#F7EBDD",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#F5E6CB",
  },
  tagText: {
    fontSize: 14,
    color: "#7A4B2F",
    fontWeight: "600",
  },
  aboutText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#3D2B1F",
    backgroundColor: "#FFF8EE",
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#F5E6CB",
  },
  credentialItem: {
    backgroundColor: "#FFF8EE",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F5E6CB",
  },
  credentialText: {
    fontSize: 15,
    color: "#7A4B2F",
    fontWeight: "500",
    lineHeight: 22,
  },
});

export default TherapistProfileScreen;

