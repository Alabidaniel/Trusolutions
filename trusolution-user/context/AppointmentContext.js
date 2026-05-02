import React, { createContext, useContext, useMemo, useState } from "react";

const AppointmentContext = createContext(null);

const buildBookingId = () =>
  `BK-${Math.floor(100000 + Math.random() * 900000).toString()}`;

const shiftIsoDate = (isoDate, days) => {
  const date = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return isoDate;
  }
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
};

export function AppointmentProvider({ children }) {
  const [appointments, setAppointments] = useState([]);

  const addAppointment = ({ therapist, date, time, sessionType }) => {
    const newAppointment = {
      id: `appointment-${Date.now()}`,
      bookingId: buildBookingId(),
      therapist,
      date,
      time,
      sessionType,
      status: "Confirmed",
      createdAt: new Date().toISOString(),
      reminder: {
        dayBefore: true,
        oneHourBefore: true,
      },
    };

    setAppointments((prev) => [newAppointment, ...prev]);
    return newAppointment;
  };

  const cancelAppointment = (appointmentId) => {
    setAppointments((prev) =>
      prev.map((item) =>
        item.id === appointmentId ? { ...item, status: "Canceled" } : item,
      ),
    );
  };

  const rescheduleAppointment = (appointmentId, nextDate) => {
    setAppointments((prev) =>
      prev.map((item) =>
        item.id === appointmentId
          ? { ...item, date: nextDate || shiftIsoDate(item.date, 1) }
          : item,
      ),
    );
  };

  const getAppointmentById = (appointmentId) =>
    appointments.find((item) => item.id === appointmentId) || null;

  const upcomingAppointment =
    appointments.find((item) => item.status === "Confirmed") || null;

  const value = useMemo(
    () => ({
      appointments,
      upcomingAppointment,
      addAppointment,
      cancelAppointment,
      rescheduleAppointment,
      getAppointmentById,
    }),
    [appointments, upcomingAppointment],
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
