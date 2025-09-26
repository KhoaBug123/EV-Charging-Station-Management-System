import { create } from "zustand";
import { persist } from "zustand/middleware";

const useBookingStore = create(
  persist(
    (set, get) => ({
      // State
      bookings: [],
      currentBooking: null,
      bookingHistory: [],
      chargingSession: null, // Current active charging session
      socTracking: {}, // SOC tracking by booking ID
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
          scannedAt: bookingData.scannedAt,
          autoStart: bookingData.autoStart,
          bookingDate: new Date().toISOString().split('T')[0], // Add booking date
          // Scheduling information
          schedulingType: bookingData.schedulingType || 'immediate',
          scheduledDateTime: bookingData.scheduledDateTime,
          scheduledDate: bookingData.scheduledDate,
          scheduledTime: bookingData.scheduledTime,
        };

        const booking = {
          ...cleanData,
          id: `BOOK${Date.now()}`,
          status: cleanData.schedulingType === 'scheduled' ? "scheduled" : "confirmed",
          createdAt: new Date().toISOString(),
          estimatedArrival: cleanData.schedulingType === 'scheduled' 
            ? cleanData.scheduledDateTime 
            : new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutes from now for immediate
        };

        // Initialize SOC tracking for this booking
        set((state) => ({
          bookings: [...state.bookings, booking],
          bookingHistory: [...state.bookingHistory, booking],
          currentBooking: booking,
          socTracking: {
            ...state.socTracking,
            [booking.id]: {
              initialSOC: null,
              currentSOC: null,
              targetSOC: null,
              lastUpdated: null,
              chargingRate: null,
              estimatedTimeToTarget: null,
            }
          }
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
        const chargingSession = {
          bookingId,
          startTime: new Date().toISOString(),
          status: "active",
          sessionId: `SESSION${Date.now()}`,
        };

        set((state) => ({
          ...state,
          chargingSession,
        }));

        get().updateBookingStatus(bookingId, "charging", {
          chargingStartedAt: new Date().toISOString(),
          sessionId: chargingSession.sessionId,
        });
      },

      // New SOC tracking methods
      updateSOC: (bookingId, socData) => {
        set((state) => ({
          socTracking: {
            ...state.socTracking,
            [bookingId]: {
              ...state.socTracking[bookingId],
              ...socData,
              lastUpdated: new Date().toISOString(),
            }
          }
        }));
      },

      initializeSOCTracking: (bookingId, initialSOC, targetSOC = 80) => {
        set((state) => ({
          socTracking: {
            ...state.socTracking,
            [bookingId]: {
              initialSOC,
              currentSOC: initialSOC,
              targetSOC,
              lastUpdated: new Date().toISOString(),
              chargingRate: null,
              estimatedTimeToTarget: null,
            }
          }
        }));
      },

      updateChargingProgress: (bookingId, progressData) => {
        const {
          currentSOC,
          chargingRate,
          powerDelivered,
          energyDelivered,
          voltage,
          current,
          temperature
        } = progressData;

        const socData = get().socTracking[bookingId];
        let estimatedTimeToTarget = null;

        if (socData && chargingRate && socData.targetSOC) {
          const remainingSOC = socData.targetSOC - currentSOC;
          estimatedTimeToTarget = Math.max(0, Math.round((remainingSOC / chargingRate) * 60)); // minutes
        }

        set((state) => ({
          socTracking: {
            ...state.socTracking,
            [bookingId]: {
              ...state.socTracking[bookingId],
              currentSOC,
              chargingRate,
              estimatedTimeToTarget,
              lastUpdated: new Date().toISOString(),
            }
          },
          chargingSession: state.chargingSession?.bookingId === bookingId ? {
            ...state.chargingSession,
            currentSOC,
            powerDelivered,
            energyDelivered,
            voltage,
            current,
            temperature,
            lastUpdated: new Date().toISOString(),
          } : state.chargingSession
        }));

        // Update booking with latest charging data
        get().updateBookingStatus(bookingId, "charging", {
          currentSOC,
          energyDelivered,
          powerDelivered,
          chargingRate,
          lastUpdated: new Date().toISOString(),
        });
      },

      getSOCProgress: (bookingId) => {
        const { socTracking } = get();
        return socTracking[bookingId] || null;
      },

      getChargingSession: () => {
        return get().chargingSession;
      },

      stopCharging: (bookingId, chargingData) => {
        const socData = get().socTracking[bookingId];
        const finalSOC = chargingData.finalSOC || socData?.currentSOC;

        set((state) => ({
          chargingSession: null,
        }));

        get().updateBookingStatus(bookingId, "completed", {
          chargingEndedAt: new Date().toISOString(),
          finalSOC,
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
              (booking.status === "confirmed" || booking.status === "scheduled") &&
              new Date(booking.scheduledDateTime || booking.estimatedArrival) > now
          )
          .sort(
            (a, b) =>
              new Date(a.scheduledDateTime || a.estimatedArrival) - new Date(b.scheduledDateTime || b.estimatedArrival)
          );
      },

      getScheduledBookings: () => {
        const { bookings } = get();
        return bookings.filter(booking => booking.schedulingType === 'scheduled');
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
            bookingDate: "2024-11-24",
            initialSOC: 15,
            finalSOC: 85,
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
            bookingDate: "2024-11-23",
            cancellationReason: "User cancelled - Change of plans",
          },
        ];

        // Initialize SOC tracking for mock data
        const mockSOCTracking = {
          "BOOK1732457890123": {
            initialSOC: 15,
            currentSOC: 85,
            targetSOC: 80,
            lastUpdated: "2024-11-24T10:15:00.000Z",
            chargingRate: 35.2, // %/hour
            estimatedTimeToTarget: 0,
          }
        };

        set({ 
          bookingHistory: mockBookings,
          socTracking: mockSOCTracking
        });
      },
    }),
    {
      name: "booking-store",
      partialize: (state) => ({
        bookings: state.bookings,
        bookingHistory: state.bookingHistory,
        currentBooking: state.currentBooking,
        socTracking: state.socTracking,
        chargingSession: state.chargingSession,
      }),
    }
  )
);

export default useBookingStore;
