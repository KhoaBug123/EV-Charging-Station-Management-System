// Mock API services for development environment
import { mockData } from "./mockData.js";

// Simulate network delay
const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

// =================================
// AUTHENTICATION API MOCK
// =================================

export const authAPI = {
  async login(credentials) {
    await delay(500);

    const user = mockData.users.find(
      (u) =>
        u.email === credentials.email && u.password === credentials.password
    );

    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Generate mock JWT token
    const token = `mock.jwt.token.${user.id}.${Date.now()}`;

    return {
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          profile: user.profile,
          ...(user.business && { business: user.business }),
          ...(user.vehicle && { vehicle: user.vehicle }),
          ...(user.preferences && { preferences: user.preferences }),
        },
        token,
        expiresIn: 86400, // 24 hours
      },
    };
  },

  async register(userData) {
    await delay(600);

    // Check if email already exists
    const existingUser = mockData.users.find((u) => u.email === userData.email);
    if (existingUser) {
      throw new Error("Email already registered");
    }

    // Create new user
    const newUser = {
      id: `${userData.role}-${Date.now()}`,
      email: userData.email,
      password: userData.password,
      role: userData.role,
      profile: {
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        avatar: "/assets/avatars/default.jpg",
        createdAt: new Date().toISOString(),
        verified: false,
      },
    };

    // Add to mock database
    mockData.users.push(newUser);

    return {
      success: true,
      message: "Registration successful! Please verify your email.",
      data: { userId: newUser.id },
    };
  },

  async forgotPassword(email) {
    await delay(400);

    const user = mockData.users.find((u) => u.email === email);
    if (!user) {
      throw new Error("Email not found");
    }

    return {
      success: true,
      message: "Password reset email sent successfully",
    };
  },

  async validateToken(token) {
    await delay(200);

    if (!token || !token.startsWith("mock.jwt.token")) {
      throw new Error("Invalid token");
    }

    const userId = token.split(".")[3];
    const user = mockData.users.find((u) => u.id === userId);

    if (!user) {
      throw new Error("User not found");
    }

    return {
      success: true,
      data: { user },
    };
  },
};

// =================================
// STATIONS API MOCK
// =================================

export const stationsAPI = {
  async getAll(filters = {}) {
    await delay(400);

    let stations = [...mockData.stations];

    // Apply filters
    if (filters.ownerId) {
      stations = stations.filter((s) => s.ownerId === filters.ownerId);
    }

    if (filters.status) {
      stations = stations.filter((s) => s.status === filters.status);
    }

    if (filters.type) {
      stations = stations.filter((s) => s.type === filters.type);
    }

    return {
      success: true,
      data: stations,
      pagination: {
        total: stations.length,
        page: 1,
        limit: 50,
      },
    };
  },

  async getById(stationId) {
    await delay(300);

    const station = mockData.stations.find((s) => s.id === stationId);
    if (!station) {
      throw new Error("Station not found");
    }

    return {
      success: true,
      data: station,
    };
  },

  async getNearby(coordinates, radius = 10) {
    await delay(500);

    // Simple distance calculation (mock)
    const stations = mockData.stations.filter((station) => {
      const distance =
        Math.abs(station.location.coordinates.lat - coordinates.lat) +
        Math.abs(station.location.coordinates.lng - coordinates.lng);
      return distance <= radius * 0.01; // Rough conversion
    });

    return {
      success: true,
      data: stations.map((station) => ({
        ...station,
        distance: Math.random() * radius, // Mock distance
      })),
    };
  },

  async create(stationData) {
    await delay(600);

    const newStation = {
      id: `station-${Date.now()}`,
      ...stationData,
      status: "pending",
      ratings: {
        overall: 0,
        cleanliness: 0,
        availability: 0,
        speed: 0,
        totalReviews: 0,
      },
      createdAt: new Date().toISOString(),
    };

    mockData.stations.push(newStation);

    return {
      success: true,
      data: newStation,
      message: "Station created successfully",
    };
  },

  async update(stationId, updateData) {
    await delay(400);

    const stationIndex = mockData.stations.findIndex((s) => s.id === stationId);
    if (stationIndex === -1) {
      throw new Error("Station not found");
    }

    mockData.stations[stationIndex] = {
      ...mockData.stations[stationIndex],
      ...updateData,
      updatedAt: new Date().toISOString(),
    };

    return {
      success: true,
      data: mockData.stations[stationIndex],
      message: "Station updated successfully",
    };
  },
};

// =================================
// BOOKINGS API MOCK
// =================================

export const bookingsAPI = {
  async getAll(filters = {}) {
    await delay(350);

    let bookings = [...mockData.bookings];

    if (filters.customerId) {
      bookings = bookings.filter((b) => b.customerId === filters.customerId);
    }

    if (filters.stationId) {
      bookings = bookings.filter((b) => b.stationId === filters.stationId);
    }

    if (filters.status) {
      bookings = bookings.filter((b) => b.status === filters.status);
    }

    // Enrich with station data
    const enrichedBookings = bookings.map((booking) => ({
      ...booking,
      station: mockData.stations.find((s) => s.id === booking.stationId),
    }));

    return {
      success: true,
      data: enrichedBookings,
    };
  },

  async create(bookingData) {
    await delay(500);

    // Check station availability
    const station = mockData.stations.find(
      (s) => s.id === bookingData.stationId
    );
    if (!station || station.charging.availablePorts === 0) {
      throw new Error("No available charging ports");
    }

    const newBooking = {
      id: `booking-${Date.now()}`,
      ...bookingData,
      status: "scheduled",
      createdAt: new Date().toISOString(),
    };

    mockData.bookings.push(newBooking);

    // Update station availability
    station.charging.availablePorts -= 1;

    return {
      success: true,
      data: newBooking,
      message: "Booking created successfully",
    };
  },

  async cancel(bookingId) {
    await delay(300);

    const bookingIndex = mockData.bookings.findIndex((b) => b.id === bookingId);
    if (bookingIndex === -1) {
      throw new Error("Booking not found");
    }

    const booking = mockData.bookings[bookingIndex];
    if (booking.status === "active") {
      throw new Error("Cannot cancel active charging session");
    }

    booking.status = "cancelled";
    booking.cancelledAt = new Date().toISOString();

    return {
      success: true,
      message: "Booking cancelled successfully",
    };
  },
};

// =================================
// USERS API MOCK
// =================================

export const usersAPI = {
  async getAll(filters = {}) {
    await delay(400);

    let users = [...mockData.users];

    if (filters.role) {
      users = users.filter((u) => u.role === filters.role);
    }

    if (filters.verified !== undefined) {
      users = users.filter((u) => u.profile.verified === filters.verified);
    }

    // Remove sensitive data
    const safeUsers = users.map((user) => ({
      id: user.id,
      email: user.email,
      role: user.role,
      profile: user.profile,
      ...(user.business && { business: user.business }),
    }));

    return {
      success: true,
      data: safeUsers,
    };
  },

  async getById(userId) {
    await delay(250);

    const user = mockData.users.find((u) => u.id === userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Remove password
    const { password, ...safeUser } = user;
    return {
      success: true,
      data: safeUser,
    };
  },

  async update(userId, updateData) {
    await delay(350);

    const userIndex = mockData.users.findIndex((u) => u.id === userId);
    if (userIndex === -1) {
      throw new Error("User not found");
    }

    mockData.users[userIndex] = {
      ...mockData.users[userIndex],
      ...updateData,
      updatedAt: new Date().toISOString(),
    };

    const { password, ...safeUser } = mockData.users[userIndex];
    return {
      success: true,
      data: safeUser,
      message: "Profile updated successfully",
    };
  },
};

// =================================
// SOC TRACKING API MOCK
// =================================

export const socAPI = {
  // Mock SOC data storage
  _socSessions: new Map(),
  
  async initializeSOCSession(bookingId, vehicleData) {
    await delay(200);
    
    const initialSOC = vehicleData.initialSOC || (20 + Math.random() * 50); // 20-70%
    const targetSOC = vehicleData.targetSOC || 80;
    const batteryCapacity = vehicleData.batteryCapacity || 60; // kWh
    
    const session = {
      bookingId,
      vehicleId: vehicleData.vehicleId || `vehicle-${Date.now()}`,
      batteryCapacity,
      initialSOC: parseFloat(initialSOC.toFixed(1)),
      currentSOC: parseFloat(initialSOC.toFixed(1)),
      targetSOC,
      startTime: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      chargingRate: 0,
      estimatedTimeToTarget: null,
      status: 'connected',
      chargingHistory: []
    };
    
    this._socSessions.set(bookingId, session);
    
    return {
      success: true,
      data: session,
      message: 'SOC tracking initialized'
    };
  },

  async getSOCStatus(bookingId) {
    await delay(150);
    
    const session = this._socSessions.get(bookingId);
    if (!session) {
      throw new Error('SOC session not found');
    }
    
    return {
      success: true,
      data: session
    };
  },

  async updateSOC(bookingId, chargingData) {
    await delay(100);
    
    const session = this._socSessions.get(bookingId);
    if (!session) {
      throw new Error('SOC session not found');
    }
    
    // Simulate realistic charging curve
    const timeDiff = (new Date() - new Date(session.lastUpdated)) / (1000 * 60); // minutes
    let socIncrease = 0;
    
    if (session.status === 'charging' && chargingData.powerDelivered) {
      // Calculate SOC increase based on power and time
      const energyAdded = (chargingData.powerDelivered * timeDiff) / 60; // kWh
      socIncrease = (energyAdded / session.batteryCapacity) * 100;
      
      // Apply charging curve (slower at high SOC)
      if (session.currentSOC > 80) {
        socIncrease *= 0.3; // Much slower above 80%
      } else if (session.currentSOC > 60) {
        socIncrease *= 0.7; // Slower above 60%
      }
    }
    
    const newSOC = Math.min(session.currentSOC + socIncrease, session.targetSOC);
    const chargingRate = socIncrease > 0 ? (socIncrease / timeDiff) * 60 : 0; // %/hour
    
    // Calculate estimated time to target
    let estimatedTime = null;
    if (chargingRate > 0 && newSOC < session.targetSOC) {
      estimatedTime = ((session.targetSOC - newSOC) / chargingRate) * 60; // minutes
    }
    
    // Update session
    session.currentSOC = parseFloat(newSOC.toFixed(1));
    session.chargingRate = parseFloat(chargingRate.toFixed(1));
    session.estimatedTimeToTarget = estimatedTime ? Math.round(estimatedTime) : null;
    session.lastUpdated = new Date().toISOString();
    
    // Add to history
    session.chargingHistory.push({
      timestamp: new Date().toISOString(),
      soc: session.currentSOC,
      power: chargingData.powerDelivered || 0,
      voltage: chargingData.voltage || 0,
      current: chargingData.current || 0,
      temperature: chargingData.temperature || 25
    });
    
    // Auto-complete if target reached
    if (session.currentSOC >= session.targetSOC) {
      session.status = 'completed';
      session.completedAt = new Date().toISOString();
    }
    
    return {
      success: true,
      data: session,
      message: 'SOC updated successfully'
    };
  },

  async startCharging(bookingId) {
    await delay(200);
    
    const session = this._socSessions.get(bookingId);
    if (!session) {
      throw new Error('SOC session not found');
    }
    
    session.status = 'charging';
    session.chargingStartedAt = new Date().toISOString();
    
    return {
      success: true,
      data: session,
      message: 'Charging started'
    };
  },

  async stopCharging(bookingId) {
    await delay(200);
    
    const session = this._socSessions.get(bookingId);
    if (!session) {
      throw new Error('SOC session not found');
    }
    
    session.status = 'stopped';
    session.chargingStoppedAt = new Date().toISOString();
    session.finalSOC = session.currentSOC;
    
    return {
      success: true,
      data: session,
      message: 'Charging stopped'
    };
  },

  // Simulate real-time SOC updates
  simulateRealTimeUpdates(bookingId, callback) {
    const interval = setInterval(async () => {
      try {
        const session = this._socSessions.get(bookingId);
        if (!session || session.status !== 'charging') {
          clearInterval(interval);
          return;
        }
        
        // Mock charging data
        const mockChargingData = {
          powerDelivered: 45 + Math.random() * 15, // 45-60 kW
          voltage: 380 + Math.random() * 20, // 380-400V
          current: 110 + Math.random() * 30, // 110-140A
          temperature: 30 + Math.random() * 15 // 30-45°C
        };
        
        const result = await this.updateSOC(bookingId, mockChargingData);
        callback(result.data);
        
      } catch (error) {
        console.error('SOC simulation error:', error);
        clearInterval(interval);
      }
    }, 3000); // Update every 3 seconds
    
    return interval;
  }
};

// =================================
// QR SCANNER API MOCK
// =================================

export const qrAPI = {
  // Mock QR code database
  _qrCodes: new Map(),
  
  async validateQRCode(qrData) {
    await delay(300);
    
    // Expected format: "SKAEV:STATION:{stationId}:{portId}"
    if (!qrData.startsWith('SKAEV:STATION:')) {
      throw new Error('Invalid QR code format');
    }
    
    const parts = qrData.split(':');
    if (parts.length < 3) {
      throw new Error('Incomplete QR code data');
    }
    
    const stationId = parts[2];
    const portId = parts[3] || 'default';
    
    // Find station
    const station = mockData.stations.find(s => s.id === stationId);
    if (!station) {
      throw new Error('Station not found');
    }
    
    // Check station status
    if (station.status !== 'active') {
      throw new Error('Station is not operational');
    }
    
    // Check port availability
    if (station.charging.availablePorts <= 0) {
      throw new Error('No available charging ports');
    }
    
    // Validate specific port
    const portInfo = await this.getPortStatus(stationId, portId);
    if (!portInfo.available) {
      throw new Error('Selected charging port is not available');
    }
    
    return {
      success: true,
      data: {
        stationId,
        station,
        portId,
        portInfo,
        timestamp: new Date().toISOString()
      },
      message: 'QR code validated successfully'
    };
  },

  async getPortStatus(stationId, portId) {
    await delay(150);
    
    // Mock port status
    const isOccupied = Math.random() < 0.3; // 30% chance port is occupied
    
    return {
      success: true,
      data: {
        portId,
        stationId,
        available: !isOccupied,
        status: isOccupied ? 'occupied' : 'available',
        connector: {
          type: ['Type 2', 'CCS2', 'CHAdeMO'][Math.floor(Math.random() * 3)],
          maxPower: 50 + Math.random() * 100, // 50-150kW
        },
        lastUsed: isOccupied ? null : new Date(Date.now() - Math.random() * 86400000).toISOString(),
        maintenanceStatus: 'operational'
      }
    };
  },

  async createQRBooking(qrData, userPreferences = {}) {
    await delay(400);
    
    // First validate QR code
    const validation = await this.validateQRCode(qrData);
    const { station, portId } = validation.data;
    
    // Create automatic booking
    const bookingData = {
      stationId: station.id,
      stationName: station.name,
      portId,
      userId: userPreferences.userId || 'guest',
      chargerType: {
        id: 'auto',
        name: 'Auto-selected',
        power: `${station.charging.maxPower} kW`,
        price: `${station.charging.pricing.dcRate || station.charging.pricing.acRate} VNĐ/kWh`,
      },
      connector: {
        id: 'auto',
        name: 'Auto-detected',
        compatible: 'Universal',
      },
      slot: {
        id: portId,
        location: `Port ${portId}`,
      },
      bookingTime: new Date().toISOString(),
      scannedAt: new Date().toISOString(),
      autoStart: true,
      schedulingType: 'immediate',
      source: 'qr_scan'
    };
    
    // Create booking through existing API
    const booking = await bookingsAPI.create(bookingData);
    
    return {
      success: true,
      data: {
        booking: booking.data,
        station,
        portId,
        autoInitiated: true
      },
      message: 'QR booking created successfully'
    };
  },

  // Generate QR codes for stations
  async generateStationQR(stationId, portId = null) {
    await delay(200);
    
    const station = mockData.stations.find(s => s.id === stationId);
    if (!station) {
      throw new Error('Station not found');
    }
    
    const ports = portId ? [portId] : ['A01', 'A02', 'B01', 'B02', 'C01'];
    const qrCodes = [];
    
    for (const port of ports) {
      const qrData = `SKAEV:STATION:${stationId}:${port}`;
      qrCodes.push({
        portId: port,
        qrData,
        qrImage: `data:image/svg+xml;base64,${btoa(`<svg>QR-${stationId}-${port}</svg>`)}`, // Mock QR image
        generatedAt: new Date().toISOString()
      });
    }
    
    return {
      success: true,
      data: {
        stationId,
        stationName: station.name,
        qrCodes
      },
      message: 'QR codes generated successfully'
    };
  }
};

// =================================
// ANALYTICS API MOCK
// =================================

export const analyticsAPI = {
  async getSystemOverview() {
    await delay(600);

    return {
      success: true,
      data: mockData.analytics.systemOverview,
    };
  },

  async getRevenue(period = "monthly") {
    await delay(500);

    return {
      success: true,
      data: mockData.analytics.revenueData,
    };
  },

  async getStationUsage(ownerId = null) {
    await delay(450);

    let usage = mockData.analytics.stationUsage;

    if (ownerId) {
      const ownerStations = mockData.stations
        .filter((s) => s.ownerId === ownerId)
        .map((s) => s.id);

      usage = usage.filter((u) => ownerStations.includes(u.stationId));
    }

    return {
      success: true,
      data: usage,
    };
  },
};

// =================================
// EXPORT ALL API SERVICES
// =================================

export const mockAPI = {
  auth: authAPI,
  stations: stationsAPI,
  bookings: bookingsAPI,
  users: usersAPI,
  analytics: analyticsAPI,
  soc: socAPI,
  qr: qrAPI,
};

export default mockAPI;
