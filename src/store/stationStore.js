import { create } from "zustand";
import { mockStations, mockBookings } from "../data/mockData";

const useStationStore = create((set, get) => ({
  // State
  stations: mockStations,
  selectedStation: null,
  nearbyStations: [],
  loading: false,
  error: null,
  filters: {
    maxDistance: 20, // km
    connectorTypes: [],
    maxPrice: null,
  },

  // Actions
  setStations: (stations) => set({ stations }),

  setSelectedStation: (station) => set({ selectedStation: station }),

  setNearbyStations: (stations) => set({ nearbyStations: stations }),

  updateFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),

  clearFilters: () =>
    set({
      filters: {
        maxDistance: 20,
        connectorTypes: [],
        maxPrice: null,
      },
    }),

  // Mock API calls
  fetchStations: async () => {
    set({ loading: true, error: null });
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      set({ stations: mockStations, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  fetchNearbyStations: async (userLocation, radius = 20) => {
    set({ loading: true, error: null });
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Mock: filter stations by distance (simplified)
      const nearby = mockStations.filter((station) => {
        // Simple distance calculation (in real app, use proper geo calculation)
        const distance = Math.random() * 25; // Mock distance
        return distance <= radius;
      });

      set({ nearbyStations: nearby, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  getFilteredStations: () => {
    const { stations, filters } = get();

    return stations.filter((station) => {
      // Filter by connector types
      if (filters.connectorTypes.length > 0) {
        const hasMatchingConnector = filters.connectorTypes.some((type) =>
          station.charging.connectorTypes.includes(type)
        );
        if (!hasMatchingConnector) return false;
      }

      // Filter by max price
      if (filters.maxPrice) {
        const maxStationPrice = Math.max(
          station.charging.pricing.acRate || 0,
          station.charging.pricing.dcRate || 0
        );
        if (maxStationPrice > filters.maxPrice) return false;
      }

      return true;
    });
  },

  // Station availability helpers
  getAvailableStations: () => {
    const { stations } = get();
    return stations.filter(
      (station) =>
        station.status === "active" && station.charging.availablePorts > 0
    );
  },

  getStationById: (stationId) => {
    const { stations } = get();
    return stations.find((station) => station.id === stationId);
  },
}));

export default useStationStore;
