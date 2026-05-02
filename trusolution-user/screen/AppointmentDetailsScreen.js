import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppointments } from "../context/AppointmentContext";

export default function AppointmentDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { appointmentId } = route.params || {};
  const {
    getAppointmentById,
    upcomingAppointment,
    cancelAppointment,
    rescheduleAppointment,
  } = useAppointments();

  const appointment = getAppointmentById(appointmentId) || upcomingAppointment;

  if (!appointment) {
    return (
      <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No appointment details found</Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate("Therapist")}
          >
            <Text style={styles.primaryButtonText}>Book New Session</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const isCanceled = appointment.status === "Canceled";

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom + 10 },
      ]}
    >
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color="#3D2B1F" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Appointment Details</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>{appointment.therapist.name}</Text>
          <Text style={styles.heroSub}>{appointment.therapist.specialty}</Text>
          <View style={[styles.statusPill, isCanceled && styles.statusPillCanceled]}>
            <Text style={[styles.statusText, isCanceled && styles.statusTextCanceled]}>
              {appointment.status}
            </Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Session Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date</Text>
            <Text style={styles.infoValue}>{appointment.date}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Time</Text>
            <Text style={styles.infoValue}>{appointment.time}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Session Type</Text>
            <Text style={styles.infoValue}>{appointment.sessionType}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Booking ID</Text>
            <Text style={styles.infoValue}>{appointment.bookingId}</Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Actions</Text>
          <TouchableOpacity
            style={[styles.primaryButton, isCanceled && styles.disabledButton]}
            disabled={isCanceled}
            onPress={() =>
              navigation.navigate("PeerChat", {
                peerName: appointment.therapist.name,
                conversationStyle: "Professional support",
                chatType: "therapist",
              })
            }
          >
            <Text style={styles.primaryButtonText}>Message Therapist</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryButton, isCanceled && styles.disabledLightButton]}
            disabled={isCanceled}
            onPress={() => rescheduleAppointment(appointment.id)}
          >
            <Text style={[styles.secondaryButtonText, isCanceled && styles.disabledLightText]}>
              Quick Reschedule (+1 day)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.cancelButton, isCanceled && styles.disabledLightButton]}
            disabled={isCanceled}
            onPress={() => cancelAppointment(appointment.id)}
          >
            <Text style={[styles.cancelButtonText, isCanceled && styles.disabledLightText]}>
              Cancel Session
            </Text>
          </TouchableOpacity>
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
  headerButton: {
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
    fontSize: 21,
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
  heroTitle: {
    color: "#FFF9F3",
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 4,
  },
  heroSub: {
    color: "#F7E2D6",
    fontSize: 14,
    marginBottom: 10,
  },
  statusPill: {
    alignSelf: "flex-start",
    borderRadius: 999,
    backgroundColor: "#E7F4E1",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  statusPillCanceled: {
    backgroundColor: "#F9D8D2",
  },
  statusText: {
    color: "#256D3C",
    fontWeight: "800",
    fontSize: 12,
  },
  statusTextCanceled: {
    color: "#9D2B1F",
  },
  sectionCard: {
    backgroundColor: "#FFF8EE",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ECD8C1",
    padding: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#3D2B1F",
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F0E0CF",
  },
  infoLabel: {
    color: "#8A6A57",
    fontSize: 13,
  },
  infoValue: {
    color: "#3D2B1F",
    fontSize: 13,
    fontWeight: "700",
  },
  primaryButton: {
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
    backgroundColor: "#F9F1E5",
    borderWidth: 1,
    borderColor: "#E4C9A8",
    borderRadius: 14,
    alignItems: "center",
    paddingVertical: 14,
    marginBottom: 8,
  },
  secondaryButtonText: {
    color: "#7A4B2F",
    fontWeight: "800",
    fontSize: 14,
  },
  cancelButton: {
    backgroundColor: "#FDEBE8",
    borderWidth: 1,
    borderColor: "#F5CEC7",
    borderRadius: 14,
    alignItems: "center",
    paddingVertical: 14,
  },
  cancelButtonText: {
    color: "#9D2B1F",
    fontWeight: "800",
    fontSize: 14,
  },
  disabledButton: {
    backgroundColor: "#BFAE9A",
  },
  disabledLightButton: {
    backgroundColor: "#EFE5D8",
    borderColor: "#E7D9C7",
  },
  disabledLightText: {
    color: "#A6937E",
  },
  homeButton: {
    backgroundColor: "#3D2B1F",
    borderRadius: 14,
    alignItems: "center",
    paddingVertical: 14,
    marginTop: 2,
  },
  homeButtonText: {
    color: "#FFF9F3",
    fontWeight: "800",
    fontSize: 14,
  },
  emptyCard: {
    margin: 20,
    padding: 20,
    borderRadius: 20,
    backgroundColor: "#FFF8EE",
    borderWidth: 1,
    borderColor: "#ECD8C1",
  },
  emptyTitle: {
    color: "#3D2B1F",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 10,
    textAlign: "center",
  },
});
