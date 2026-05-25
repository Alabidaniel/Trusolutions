import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAppointments } from "../context/AppointmentContext";
import { apiRequest } from "../api/client";

export default function TherapistBookingScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { addAppointment } = useAppointments();

  const therapist = route.params?.therapist || {
    name: "Dr. Sarah Johnson",
    specialty: "Anxiety & Stress",
    rating: 4.9,
  };

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [sessionType, setSessionType] = useState("Chat");
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [booking, setBooking] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    let alive = true;

    async function loadSlots() {
      if (!therapist?.id) {
        setLoadingSlots(false);
        return;
      }

      try {
        setLoadingSlots(true);
        const result = await apiRequest(`/therapists/${therapist.id}/slots`, {
          query: { page: 1, limit: 100 },
        });
        if (!alive) return;
        setSlots(result?.items || []);
      } catch (err) {
        if (!alive) return;
        Alert.alert("Failed to load slots", err?.message || "Please try again.");
      } finally {
        if (alive) setLoadingSlots(false);
      }
    }

    loadSlots();
    return () => {
      alive = false;
    };
  }, [therapist?.id]);

  const timeSlots = useMemo(() => {
    if (!selectedDate) return [];
    return slots
      .filter((s) => String(s.startAt || "").startsWith(selectedDate))
      .map((s) => {
        const d = new Date(s.startAt);
        return {
          id: s.id,
          startAt: s.startAt,
          endAt: s.endAt,
          label: d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
      });
  }, [selectedDate, slots]);

  const sessionTypes = ["Chat", "Call", "In-Person"];

  const markedDates = useMemo(
    () => ({
      ...(selectedDate
        ? {
            [selectedDate]: {
              selected: true,
              selectedColor: "#7A4B2F",
              selectedTextColor: "#FFF8EE",
            },
          }
        : {}),
    }),
    [selectedDate],
  );

  const canConfirm = Boolean(selectedDate && selectedTime && sessionType && selectedSlot);

  const handleConfirmBooking = async () => {
    if (!canConfirm) {
      return;
    }

    try {
      setBooking(true);
      const appointment = await addAppointment({
        therapist,
        date: selectedDate,
        time: selectedTime,
        sessionType,
        slot: selectedSlot,
      });
      navigation.navigate("TherapistBookingSuccess", { appointment });
    } catch (err) {
      Alert.alert("Booking failed", err?.message || "Please try again.");
    } finally {
      setBooking(false);
    }
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.headerButton}
          >
            <Ionicons name="arrow-back" size={22} color="#3D2B1F" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Book a Session</Text>
          <View style={styles.headerSpacer} />
        </View>

        <Text style={styles.subtitle}>
          Pick a date, time, and session type that feels right for you.
        </Text>

        <View style={styles.card}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={28} color="#7A4B2F" />
          </View>
          <View style={styles.cardTextBlock}>
            <Text style={styles.name}>{therapist.name}</Text>
            <Text style={styles.specialty}>{therapist.specialty}</Text>
            <Text style={styles.meta}>
              {therapist.rating} {"\u2605"} Trusted therapist
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose a date</Text>
          <View style={styles.calendarCard}>
              <Calendar
              onDayPress={(day) => {
                setSelectedDate(day.dateString);
                setSelectedTime("");
                setSelectedSlot(null);
              }}
              markedDates={markedDates}
              enableSwipeMonths
              hideExtraDays
              style={styles.calendar}
              theme={{
                calendarBackground: "#FFF8EE",
                textSectionTitleColor: "#7A4B2F",
                monthTextColor: "#3D2B1F",
                dayTextColor: "#3D2B1F",
                todayTextColor: "#7A4B2F",
                arrowColor: "#7A4B2F",
                selectedDayBackgroundColor: "#7A4B2F",
                selectedDayTextColor: "#FFF8EE",
                textDisabledColor: "#C8B99B",
                textDayFontSize: 13,
                textMonthFontSize: 16,
                textDayHeaderFontSize: 11,
              }}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available time slots</Text>
          {loadingSlots ? (
            <View style={{ paddingVertical: 16 }}>
              <ActivityIndicator color="#7A4B2F" />
            </View>
          ) : (
            <View style={styles.optionGrid}>
              {timeSlots.map((slot) => {
                const selected = selectedTime === slot.label;
                return (
                  <TouchableOpacity
                    key={slot.id}
                    style={[styles.optionChip, selected && styles.optionChipActive]}
                    onPress={() => {
                      setSelectedTime(slot.label);
                      setSelectedSlot(slot);
                    }}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        selected && styles.optionTextActive,
                      ]}
                    >
                      {slot.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
              {!timeSlots.length ? (
                <Text style={{ color: "#8A6A57", marginTop: 8 }}>
                  No available slots for this date.
                </Text>
              ) : null}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Session type</Text>
          <View style={styles.optionGrid}>
            {sessionTypes.map((type) => {
              const selected = sessionType === type;
              return (
                <TouchableOpacity
                  key={type}
                  style={[styles.optionChip, selected && styles.optionChipActive]}
                  onPress={() => setSessionType(type)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selected && styles.optionTextActive,
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Booking Summary</Text>
          <Text style={styles.summaryText}>
            Date: {selectedDate || "Choose a date"}
          </Text>
          <Text style={styles.summaryText}>
            Time: {selectedTime || "Choose a time"}
          </Text>
          <Text style={styles.summaryText}>Type: {sessionType}</Text>
        </View>

        <TouchableOpacity
          style={[styles.button, !canConfirm && styles.buttonDisabled]}
          disabled={!canConfirm || booking}
          onPress={handleConfirmBooking}
        >
          <Text style={styles.buttonText}>{booking ? "Booking..." : "Confirm Booking"}</Text>
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
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 28,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F7EBDD",
    borderWidth: 1,
    borderColor: "#E4C9A8",
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
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: "#7A5A45",
    textAlign: "center",
    marginBottom: 18,
    paddingHorizontal: 12,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF8EE",
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ECD8C1",
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F7EBDD",
    marginRight: 14,
  },
  cardTextBlock: {
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: "800",
    color: "#3D2B1F",
  },
  specialty: {
    fontSize: 14,
    color: "#7A4B2F",
    marginTop: 3,
  },
  meta: {
    fontSize: 13,
    color: "#7A5A45",
    marginTop: 5,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#3D2B1F",
    marginBottom: 10,
  },
  calendarCard: {
    backgroundColor: "#FFF8EE",
    borderRadius: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ECD8C1",
  },
  calendar: {
    borderRadius: 16,
    alignSelf: "center",
    width: "100%",
    maxWidth: 340,
  },
  optionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  optionChip: {
    minWidth: "30%",
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: "#FFF8EE",
    borderWidth: 1,
    borderColor: "#E4C9A8",
    alignItems: "center",
    justifyContent: "center",
  },
  optionChipActive: {
    backgroundColor: "#7A4B2F",
    borderColor: "#7A4B2F",
  },
  optionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3D2B1F",
  },
  optionTextActive: {
    color: "#FFF8EE",
  },
  summaryCard: {
    backgroundColor: "#F7EBDD",
    borderRadius: 20,
    padding: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#E4C9A8",
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#3D2B1F",
    marginBottom: 10,
  },
  summaryText: {
    fontSize: 14,
    lineHeight: 22,
    color: "#6E513D",
  },
  button: {
    backgroundColor: "#3D2B1F",
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#B8A583",
  },
  buttonText: {
    color: "#FFF8EE",
    fontWeight: "800",
    fontSize: 16,
  },
});
