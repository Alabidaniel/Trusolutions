import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TherapistBookingSuccessScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const appointment = route.params?.appointment;

  if (!appointment) {
    return (
      <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <View style={styles.card}>
          <Text style={styles.title}>Booking not found</Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate("Therapist")}
          >
            <Text style={styles.primaryButtonText}>Back to Therapist</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 20 },
      ]}
    >
      <View style={styles.card}>
        <View style={styles.iconWrap}>
          <Ionicons name="checkmark" size={34} color="#256D3C" />
        </View>
        <Text style={styles.title}>Session Booked</Text>
        <Text style={styles.subtitle}>Your appointment is confirmed.</Text>

        <View style={styles.infoCard}>
          <Text style={styles.infoLine}>{appointment.therapist.name}</Text>
          <Text style={styles.infoLine}>{appointment.date} at {appointment.time}</Text>
          <Text style={styles.infoLine}>Type: {appointment.sessionType}</Text>
          <Text style={styles.infoBookingId}>Booking ID: {appointment.bookingId}</Text>
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() =>
            navigation.navigate("AppointmentDetails", {
              appointmentId: appointment.id,
            })
          }
        >
          <Text style={styles.primaryButtonText}>View Appointment</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() =>
            navigation.navigate("PeerChat", {
              peerName: appointment.therapist.name,
              conversationStyle: "Professional support",
              chatType: "therapist",
            })
          }
        >
          <Text style={styles.secondaryButtonText}>Message Therapist</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.ghostButton}
          onPress={() => navigation.navigate("MainTabs", { screen: "Home" })}
        >
          <Text style={styles.ghostButtonText}>Go Home</Text>
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
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: "#E7F4E1",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#3D2B1F",
    marginBottom: 4,
  },
  subtitle: {
    color: "#8A6A57",
    fontSize: 14,
    marginBottom: 14,
  },
  infoCard: {
    width: "100%",
    backgroundColor: "#F9F1E5",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#ECD8C1",
    padding: 14,
    marginBottom: 14,
  },
  infoLine: {
    color: "#3D2B1F",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 3,
  },
  infoBookingId: {
    marginTop: 6,
    color: "#7A4B2F",
    fontWeight: "700",
    fontSize: 12,
  },
  primaryButton: {
    width: "100%",
    backgroundColor: "#7A4B2F",
    borderRadius: 14,
    alignItems: "center",
    paddingVertical: 14,
    marginBottom: 8,
  },
  primaryButtonText: {
    color: "#FFF9F3",
    fontWeight: "800",
    fontSize: 14,
  },
  secondaryButton: {
    width: "100%",
    backgroundColor: "#3D2B1F",
    borderRadius: 14,
    alignItems: "center",
    paddingVertical: 14,
    marginBottom: 8,
  },
  secondaryButtonText: {
    color: "#FFF9F3",
    fontWeight: "800",
    fontSize: 14,
  },
  ghostButton: {
    width: "100%",
    backgroundColor: "#F9F1E5",
    borderWidth: 1,
    borderColor: "#E4C9A8",
    borderRadius: 14,
    alignItems: "center",
    paddingVertical: 14,
  },
  ghostButtonText: {
    color: "#7A4B2F",
    fontWeight: "800",
    fontSize: 14,
  },
});
