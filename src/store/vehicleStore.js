import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CONNECTOR_TYPES } from "../utils/constants";

const useVehicleStore = create(
    persist(
        (set, get) => ({
            // State
            vehicles: [
                {
                    id: "1",
                    nickname: "Xe chính",
                    make: "VinFast",
                    model: "VF8",
                    year: "2024",
                    batteryCapacity: "87.7",
                    maxChargingSpeed: "150",
                    connectorTypes: [CONNECTOR_TYPES.CCS2], // Standardized to array
                    licensePlate: "30A-123.45",
                    color: "Xanh",
                    isDefault: true,
                },
                {
                    id: "2",
                    nickname: "Xe gia đình",
                    make: "Tesla",
                    model: "Model 3",
                    year: "2023",
                    batteryCapacity: "75",
                    maxChargingSpeed: "250",
                    connectorTypes: [CONNECTOR_TYPES.CCS2, CONNECTOR_TYPES.TYPE2],
                    licensePlate: "29B-678.90",
                    color: "Trắng",
                    isDefault: false,
                },
            ],
            currentVehicle: null,
            loading: false,
            error: null,

            // Actions
            addVehicle: (vehicleData) => {
                const newVehicle = {
                    ...vehicleData,
                    id: `vehicle_${Date.now()}`,
                    connectorTypes: Array.isArray(vehicleData.connectorTypes)
                        ? vehicleData.connectorTypes
                        : [vehicleData.connectorTypes].filter(Boolean),
                };

                set((state) => ({
                    vehicles: [...state.vehicles, newVehicle]
                }));

                return newVehicle;
            },

            updateVehicle: (vehicleId, updates) => {
                set((state) => ({
                    vehicles: state.vehicles.map((vehicle) =>
                        vehicle.id === vehicleId
                            ? {
                                ...vehicle,
                                ...updates,
                                connectorTypes: Array.isArray(updates.connectorTypes)
                                    ? updates.connectorTypes
                                    : updates.connectorTypes
                                        ? [updates.connectorTypes]
                                        : vehicle.connectorTypes,
                            }
                            : vehicle
                    ),
                }));
            },

            deleteVehicle: (vehicleId) => {
                set((state) => ({
                    vehicles: state.vehicles.filter((vehicle) => vehicle.id !== vehicleId),
                    currentVehicle: state.currentVehicle?.id === vehicleId ? null : state.currentVehicle,
                }));
            },

            setDefaultVehicle: (vehicleId) => {
                set((state) => ({
                    vehicles: state.vehicles.map((vehicle) => ({
                        ...vehicle,
                        isDefault: vehicle.id === vehicleId,
                    })),
                    currentVehicle: state.vehicles.find((v) => v.id === vehicleId) || state.currentVehicle,
                }));
            },

            setCurrentVehicle: (vehicleId) => {
                const vehicle = get().vehicles.find((v) => v.id === vehicleId);
                set({ currentVehicle: vehicle });
            },

            // Getters
            getDefaultVehicle: () => {
                const { vehicles } = get();
                return vehicles.find((vehicle) => vehicle.isDefault) || vehicles[0] || null;
            },

            getVehicleById: (vehicleId) => {
                const { vehicles } = get();
                return vehicles.find((vehicle) => vehicle.id === vehicleId);
            },

            getCompatibleConnectorTypes: () => {
                const { vehicles } = get();
                const allConnectors = new Set();

                vehicles.forEach((vehicle) => {
                    if (vehicle.connectorTypes) {
                        vehicle.connectorTypes.forEach((type) => allConnectors.add(type));
                    }
                });

                return Array.from(allConnectors);
            },

            getCurrentVehicleConnectors: () => {
                const currentVehicle = get().currentVehicle || get().getDefaultVehicle();
                return currentVehicle?.connectorTypes || [];
            },

            // Utility methods
            isConnectorCompatible: (connectorType, vehicleId = null) => {
                const vehicle = vehicleId
                    ? get().getVehicleById(vehicleId)
                    : get().currentVehicle || get().getDefaultVehicle();

                if (!vehicle || !vehicle.connectorTypes) return false;
                return vehicle.connectorTypes.includes(connectorType);
            },

            // Sync with user profile
            syncWithUserProfile: (userVehicleData) => {
                if (!userVehicleData) return;

                // Convert user profile vehicle data to store format
                const syncedVehicle = {
                    id: "user_profile_vehicle",
                    nickname: "Xe từ hồ sơ",
                    make: userVehicleData.make,
                    model: userVehicleData.model,
                    year: userVehicleData.year,
                    batteryCapacity: userVehicleData.batteryCapacity?.toString(),
                    maxChargingSpeed: "150", // Default
                    connectorTypes: Array.isArray(userVehicleData.chargingType)
                        ? userVehicleData.chargingType.map(type => {
                            // Convert formats: "AC Type 2" -> "Type 2", "DC CCS" -> "CCS2"
                            if (type.includes("Type 2")) return CONNECTOR_TYPES.TYPE2;
                            if (type.includes("CCS")) return CONNECTOR_TYPES.CCS2;
                            if (type.includes("CHAdeMO")) return CONNECTOR_TYPES.CHADEMO;
                            return type;
                        })
                        : [CONNECTOR_TYPES.TYPE2], // Default fallback
                    licensePlate: "",
                    color: "",
                    isDefault: true,
                };

                // Check if profile vehicle already exists
                const existingVehicle = get().vehicles.find(v => v.id === "user_profile_vehicle");

                if (existingVehicle) {
                    get().updateVehicle("user_profile_vehicle", syncedVehicle);
                } else {
                    set((state) => ({
                        vehicles: [syncedVehicle, ...state.vehicles.map(v => ({ ...v, isDefault: false }))],
                    }));
                }
            },

            // Initialize
            initializeWithUserData: (userData) => {
                if (userData?.vehicle) {
                    get().syncWithUserProfile(userData.vehicle);
                }

                // Set default vehicle as current if none selected
                if (!get().currentVehicle) {
                    const defaultVehicle = get().getDefaultVehicle();
                    if (defaultVehicle) {
                        set({ currentVehicle: defaultVehicle });
                    }
                }
            },

            setLoading: (loading) => set({ loading }),
            setError: (error) => set({ error }),
            clearError: () => set({ error: null }),
        }),
        {
            name: "skaev-vehicle-storage",
            partialize: (state) => ({
                vehicles: state.vehicles,
                currentVehicle: state.currentVehicle,
            }),
        }
    )
);

export default useVehicleStore;