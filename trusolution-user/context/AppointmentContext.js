import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { apiRequest } from "../api/client";
import { useAuth } from "./AuthContext";

const AppointmentContext = createContext(null);

export function AppointmentProvider({ children }) {
  const { firebaseUser, initializing } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const firebaseUid = firebaseUser?.uid || null;

  const formatAppointment = (appointment) => {
    if (!appointment) return null;

    const startAt = appointment.scheduledStartAt
      ? new Date(appointment.scheduledStartAt)
      : null;
    const date =
      startAt && !Number.isNaN(startAt.getTime())
        ? startAt.toISOString().slice(0, 10)
        : "";
    const time =
      startAt && !Number.isNaN(startAt.getTime())
        ? startAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : "";

    // Properly map backend status to frontend status
    const statusMap = {
      SCHEDULED: "Scheduled",
      CONFIRMED: "Confirmed",
      CANCELED: "Canceled",
      COMPLETED: "Completed",
    };
    const status = statusMap[appointment.status] || "Unknown";

    const sessionTypeMap = {
      CHAT: "Chat",
      CALL: "Call",
      IN_PERSON: "In-Person",
    };

    return {
      id: appointment.id,
      bookingId: appointment.bookingCode,
      therapist: appointment.therapist
        ? {
            id: appointment.therapist.id,
            name: appointment.therapist.displayName,
            specialty: appointment.therapist.specialty,
          }
        : null,
      date,
      time,
      sessionType: sessionTypeMap[appointment.appointmentType] || "Chat",
      status,
      rawStatus: appointment.status,
      chatId: appointment.chat?.id || appointment.chatId || null,
      raw: appointment,
    };
  };

  const refreshUpcoming = async () => {
    setLoading(true);
    try {
      const upcoming = await apiRequest("/appointments/upcoming");
      const formatted = formatAppointment(upcoming);
      setAppointments(formatted ? [formatted] : []);
      return formatted;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initializing) {
      return;
    }

    if (!firebaseUid) {
      setAppointments([]);
      setLoading(false);
      return;
    }

    refreshUpcoming().catch(() => setLoading(false));
  }, [firebaseUid, initializing]);

  const toAppointmentType = (sessionType) => {
    if (sessionType === "Call") return "CALL";
    if (sessionType === "In-Person") return "IN_PERSON";
    return "CHAT";
  };

  const buildIsoDateTime = (dateStr, timeStr) => {
    if (!dateStr) return null;
    
    // Try multiple time formats for robustness
    const trimmedTime = String(timeStr || "").trim();
    let hour = null;
    let minute = null;

    // Format 1: "9:00 AM"
    const ampmMatch = trimmedTime.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (ampmMatch) {
      hour = Number(ampmMatch[1]);
      minute = Number(ampmMatch[2]);
      const ampm = ampmMatch[3].toUpperCase();
      if (ampm === "PM" && hour < 12) hour += 12;
      if (ampm === "AM" && hour === 12) hour = 0;
    } else {
      // Format 2: "09:00" (24-hour)
      const iso24Match = trimmedTime.match(/^(\d{1,2}):(\d{2})$/);
      if (iso24Match) {
        hour = Number(iso24Match[1]);
        minute = Number(iso24Match[2]);
      }
    }

    if (hour === null || minute === null) {
      return null;
    }

    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
      return null;
    }

    const local = new Date(`${dateStr}T00:00:00`);
    if (Number.isNaN(local.getTime())) return null;
    
    local.setHours(hour, minute, 0, 0);
    return local.toISOString();
  };

  const addAppointment = async ({
    therapist,
    date,
    time,
    sessionType,
    slot,
  }) => {
    let startIso = slot?.startAt || buildIsoDateTime(date, time);
    let endIso = slot?.endAt || null;

    if (!startIso) {
      throw new Error("Invalid date/time selection");
    }

    const start = new Date(startIso);
    if (Number.isNaN(start.getTime())) {
      throw new Error("Invalid appointment start time");
    }

    const end = endIso
      ? new Date(endIso)
      : new Date(start.getTime() + 45 * 60 * 1000);

    const created = await apiRequest("/appointments", {
      method: "POST",
      body: {
        therapistId: therapist.id,
        slotId: slot?.id,
        appointmentType: toAppointmentType(sessionType),
        scheduledStartAt: start.toISOString(),
        scheduledEndAt: end.toISOString(),
      },
    });

    // created does not include therapist include; reuse the therapist passed in.
    const formatted = {
      id: created.id,
      bookingId: created.bookingCode,
      therapist: {
        id: therapist.id,
        name: therapist.name,
        specialty: therapist.specialty,
      },
      date,
      time,
      sessionType,
      status: "Confirmed",
      chatId: created.chatId || null,
      raw: created,
    };

    setAppointments((prev) => [
      formatted,
      ...prev.filter((x) => x.id !== formatted.id),
    ]);
    refreshUpcoming().catch(() => {});
    return formatted;
  };

  const cancelAppointment = async (appointmentId) => {
    const appointment = await apiRequest(
      `/appointments/${appointmentId}/cancel`,
      {
        method: "PATCH",
      },
    );
    await refreshUpcoming();
    return formatAppointment(appointment);
  };

  const rescheduleAppointment = async (appointmentId, nextDate) => {
    const existing = appointments.find((a) => a.id === appointmentId);
    const currentDate = nextDate || existing?.date;
    const currentTime = existing?.time;
    if (!currentDate || !currentTime) {
      throw new Error("Appointment date/time unavailable");
    }

    // If caller didn't pass a nextDate, bump by +1 day.
    let effectiveDate = currentDate;
    if (!nextDate) {
      const d = new Date(`${currentDate}T00:00:00`);
      d.setDate(d.getDate() + 1);
      effectiveDate = d.toISOString().slice(0, 10);
    }

    const scheduledStartAt = buildIsoDateTime(effectiveDate, currentTime);
    const start = new Date(scheduledStartAt);
    const end = new Date(start.getTime() + 45 * 60 * 1000);

    const appointment = await apiRequest(
      `/appointments/${appointmentId}/reschedule`,
      {
        method: "PATCH",
        body: {
          scheduledStartAt: start.toISOString(),
          scheduledEndAt: end.toISOString(),
        },
      },
    );

    await refreshUpcoming();
    return formatAppointment(appointment);
  };

  const getAppointmentById = async (appointmentId) => {
    const existing =
      appointments.find((item) => item.id === appointmentId) || null;
    if (existing) return existing;
    const fetched = await apiRequest(`/appointments/${appointmentId}`);
    return formatAppointment(fetched);
  };

  const upcomingAppointment =
    appointments.find((item) =>
      ["Scheduled", "Confirmed"].includes(item.status),
    ) || null;

  const value = useMemo(
    () => ({
      appointments,
      upcomingAppointment,
      loading,
      refreshUpcoming,
      addAppointment,
      cancelAppointment,
      rescheduleAppointment,
      getAppointmentById,
    }),
    [appointments, upcomingAppointment, loading],
  );

  return (
    <AppointmentContext.Provider value={value}>
      {children}
    </AppointmentContext.Provider>
  );
}

export function useAppointments() {
  const value = useContext(AppointmentContext);
  if (!value) {
    throw new Error("useAppointments must be used within AppointmentProvider");
  }
  return value;
}
