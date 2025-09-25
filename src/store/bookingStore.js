import { create } from "zustand";
import { persist } from "zustand/middleware";

const useBookingStore = create(
  persist(
    (set, get) => ({
      // State
      bookings: [],
      currentBooking: null,
      bookingHistory: [],
      loading: false,
      error: null,

      // Actions
      createBooking: (bookingData) => {
        // Clean data to avoid circular references
        const cleanData = {
          stationId: bookingData.stationId,
          stationName: bookingData.stationName,
          chargerType: bookingData.chargerType
            ? {
                id: bookingData.chargerType.id,
                name: bookingData.chargerType.name,
                power: bookingData.chargerType.power,
                price: bookingData.chargerType.price,
              }
            : null,
          connector: bookingData.connector
            ? {
                id: bookingData.connector.id,
                name: bookingData.connector.name,
                compatible: bookingData.connector.compatible,
              }
            : null,
          slot: bookingData.slot
            ? {
                id: bookingData.slot.id,
                location: bookingData.slot.location,
              }
            : null,
          bookingTime: bookingData.bookingTime,
        };

        const booking = {
          ...cleanData,
          id: `BOOK${Date.now()}`,
          status: "confirmed",
          createdAt: new Date().toISOString(),
          estimatedArrival: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutes from now
        };

        set((state) => ({
          bookings: [...state.bookings, booking],
          bookingHistory: [...state.bookingHistory, booking],
          currentBooking: booking,
        }));

        return booking;
      },

      updateBookingStatus: (bookingId, status, data = {}) => {
        set((state) => ({
          bookings: state.bookings.map((booking) =>
            booking.id === bookingId
              ? {
                  ...booking,
                  status,
                  ...data,
                  updatedAt: new Date().toISOString(),
                }
              : booking
          ),
          bookingHistory: state.bookingHistory.map((booking) =>
            booking.id === bookingId
              ? {
                  ...booking,
                  status,
                  ...data,
                  updatedAt: new Date().toISOString(),
                }
              : booking
          ),
          currentBooking:
            state.currentBooking?.id === bookingId
              ? {
                  ...state.currentBooking,
                  status,
                  ...data,
                  updatedAt: new Date().toISOString(),
                }
              : state.currentBooking,
        }));
      },

      cancelBooking: (bookingId, reason = "User cancelled") => {
        const booking = get().bookings.find((b) => b.id === bookingId);
        if (booking) {
          get().updateBookingStatus(bookingId, "cancelled", {
            cancellationReason: reason,
            cancelledAt: new Date().toISOString(),
          });
        }
      },

      completeBooking: (bookingId, sessionData) => {
        get().updateBookingStatus(bookingId, "completed", {
          ...sessionData,
          completedAt: new Date().toISOString(),
        });
      },

      startCharging: (bookingId) => {
        get().updateBookingStatus(bookingId, "charging", {
          chargingStartedAt: new Date().toISOString(),
        });
      },

      stopCharging: (bookingId, chargingData) => {
        get().updateBookingStatus(bookingId, "completed", {
          chargingEndedAt: new Date().toISOString(),
          ...chargingData,
        });
      },

      getCurrentBooking: () => {
        const { bookings } = get();
        return bookings.find(
          (booking) =>
            booking.status === "confirmed" ||
            booking.status === "in-progress" ||
            booking.status === "charging"
        );
      },

      getBookingsByStatus: (status) => {
        const { bookings } = get();
        return bookings.filter((booking) => booking.status === status);
      },

      getUpcomingBookings: () => {
        const { bookings } = get();
        const now = new Date();
        return bookings
          .filter(
            (booking) =>
              booking.status === "confirmed" &&
              new Date(booking.estimatedArrival) > now
          )
          .sort(
            (a, b) =>
              new Date(a.estimatedArrival) - new Date(b.estimatedArrival)
          );
      },

      getPastBookings: () => {
        const { bookingHistory } = get();
        return bookingHistory
          .filter(
            (booking) =>
              booking.status === "completed" || booking.status === "cancelled"
          )
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      },

      clearCurrentBooking: () => {
        set({ currentBooking: null });
      },

      setLoading: (loading) => {
        set({ loading });
      },

      setError: (error) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      },

      // Statistics
      getBookingStats: () => {
        const { bookingHistory } = get();
        const total = bookingHistory.length;
        const completed = bookingHistory.filter(
          (b) => b.status === "completed"
        ).length;
        const cancelled = bookingHistory.filter(
          (b) => b.status === "cancelled"
        ).length;
        const totalEnergyCharged = bookingHistory
          .filter((b) => b.status === "completed" && b.energyDelivered)
          .reduce((sum, b) => sum + (b.energyDelivered || 0), 0);
        const totalAmount = bookingHistory
          .filter((b) => b.status === "completed" && b.totalAmount)
          .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

        return {
          total,
          completed,
          cancelled,
          completionRate:
            total > 0 ? ((completed / total) * 100).toFixed(1) : 0,
          totalEnergyCharged: totalEnergyCharged.toFixed(2),
          totalAmount: totalAmount.toFixed(0),
          averageSession:
            completed > 0 ? (totalEnergyCharged / completed).toFixed(2) : 0,
        };
      },

      // Mock data for development
      initializeMockData: () => {
        const mockBookings = [
          {
            id: "BOOK1732457890123",
            stationId: "ST001",
            stationName: "VinFast Charging Station - District 1",
            chargerType: {
              id: "fast",
              name: "Sạc nhanh",
              power: "50-100 kW",
              price: "8,000 VNĐ/kWh",
            },
            connector: {
              id: "ccs2_dc",
              name: "CCS2 (DC)",
              compatible: "BMW, Mercedes, VW",
            },
            slot: {
              id: "A01",
              location: "Khu vực A - Slot 01",
            },
            status: "completed",
            createdAt: "2024-11-24T08:30:00.000Z",
            completedAt: "2024-11-24T10:15:00.000Z",
            energyDelivered: 45.5,
            totalAmount: 364000,
            chargingDuration: 105, // minutes
          },
          {
            id: "BOOK1732444290456",
            stationId: "ST003",
            stationName: "Shell Recharge - District 3",
            chargerType: {
              id: "ultra",
              name: "Sạc siêu nhanh",
              power: "150-350 kW",
              price: "12,000 VNĐ/kWh",
            },
            connector: {
              id: "ccs2_ultra",
              name: "CCS2 Ultra",
              compatible: "Tesla Model S/3/X/Y",
            },
            slot: {
              id: "B02",
              location: "Khu vực B - Slot 02",
            },
            status: "cancelled",
            createdAt: "2024-11-23T14:20:00.000Z",
            cancelledAt: "2024-11-23T14:35:00.000Z",
            cancellationReason: "User cancelled - Change of plans",
          },
        ];

        set({ bookingHistory: mockBookings });
      },
    }),
    {
      name: "booking-store",
      partialize: (state) => ({
        bookings: state.bookings,
        bookingHistory: state.bookingHistory,
        currentBooking: state.currentBooking,
      }),
    }
  )
);

export default useBookingStore;
