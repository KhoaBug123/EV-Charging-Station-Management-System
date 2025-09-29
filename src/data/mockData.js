// Mock data for SkaEV development environment

// =================================
// USERS & AUTHENTICATION
// =================================

export const mockUsers = [
  // Admin Users
  {
    id: "admin-001",
    email: "admin@skaev.com",
    password: "Admin123!",
    role: "admin",
    profile: {
      firstName: "Sarah",
      lastName: "Johnson",
      avatar: "/assets/avatars/admin-sarah.jpg",
      phone: "+84 901 234 567",
      createdAt: "2024-01-15T08:00:00Z",
      lastLogin: "2024-03-15T14:30:00Z",
      permissions: ["all"],
    },
  },
  {
    id: "admin-002",
    email: "system@skaev.com",
    password: "System123!",
    role: "admin",
    profile: {
      firstName: "Michael",
      lastName: "Chen",
      avatar: "/assets/avatars/admin-michael.jpg",
      phone: "+84 902 345 678",
      createdAt: "2024-01-20T09:15:00Z",
      lastLogin: "2024-03-15T13:45:00Z",
      permissions: ["users", "stations", "reports"],
    },
  },

  // Staff Users
  {
    id: "staff-001",
    email: "staff@skaev.com",
    password: "Staff123!",
    role: "staff",
    profile: {
      firstName: "Nguyen",
      lastName: "Van Minh",
      avatar: "/assets/avatars/staff-minh.jpg",
      phone: "+84 906 789 012",
      employeeId: "ST001",
      department: "Operations",
      position: "Station Technician",
      joinDate: "2024-01-15",
      location: "Hà Nội",
      createdAt: "2024-01-15T08:30:00Z",
      lastLogin: "2024-03-15T12:15:00Z",
      permissions: ["stations", "maintenance"],
    },
  },
  {
    id: "staff-002",
    email: "technician@skaev.com",
    password: "Tech123!",
    role: "staff",
    profile: {
      firstName: "Le",
      lastName: "Thi Lan",
      avatar: "/assets/avatars/staff-lan.jpg",
      phone: "+84 907 890 123",
      employeeId: "ST002",
      department: "Technical Support",
      position: "Senior Technician",
      joinDate: "2024-02-01",
      location: "Hồ Chí Minh",
      createdAt: "2024-02-01T09:00:00Z",
      lastLogin: "2024-03-15T11:30:00Z",
      permissions: ["stations", "maintenance", "support"],
    },
  },

  // Customers
  {
    id: "customer-001",
    email: "john.doe@gmail.com",
    password: "Customer123!",
    role: "customer",
    profile: {
      firstName: "John",
      lastName: "Doe",
      avatar: "/assets/avatars/customer-john.jpg",
      phone: "+84 905 678 901",
      createdAt: "2024-02-15T14:20:00Z",
      lastLogin: "2024-03-15T17:30:00Z",
      verified: true,
    },
    vehicle: {
      make: "Tesla",
      model: "Model 3",
      year: 2023,
      batteryCapacity: 75, // kWh
      chargingType: ["AC Type 2", "DC CCS"],
    },
    preferences: {
      maxDistance: 15, // km
      preferredPayment: "credit-card",
      priceRange: [5000, 15000], // VND per kWh
    },
  },
  {
    id: "customer-002",
    email: "anna.nguyen@outlook.com",
    password: "Customer456!",
    role: "customer",
    profile: {
      firstName: "Anna",
      lastName: "Nguyen",
      avatar: "/assets/avatars/customer-anna.jpg",
      phone: "+84 906 789 012",
      createdAt: "2024-02-20T09:45:00Z",
      lastLogin: "2024-03-15T18:15:00Z",
      verified: true,
    },
    vehicle: {
      make: "VinFast",
      model: "VF 8",
      year: 2024,
      batteryCapacity: 87.7,
      chargingType: ["AC Type 2", "DC CCS"],
    },
    preferences: {
      maxDistance: 20,
      preferredPayment: "e-wallet",
      priceRange: [6000, 12000],
    },
  },
];

// =================================
// CHARGING STATIONS
// =================================

export const mockStations = [
  {
    id: "station-001",
    ownerId: "system",
    name: "Green Mall Charging Hub",
    type: "public",
    status: "active",
    location: {
      address: "123 Đường Nguyễn Huệ, Quận 1, Thành phố Hồ Chí Minh",
      coordinates: { lat: 10.7769, lng: 106.7009 },
      landmarks: ["Nguyen Hue Walking Street", "Saigon Centre"],
    },

    operatingHours: {
      open: "06:00",
      close: "22:00",
      timezone: "Asia/Ho_Chi_Minh",
    },
    charging: {
      // Trụ sạc (Charging Posts) với các công suất khác nhau
      chargingPosts: [
        {
          id: "post-A",
          name: "Trụ AC Tiêu chuẩn",
          type: "AC",
          power: 7, // kW
          voltage: 230, // V
          totalSlots: 3,
          availableSlots: 2,
          slots: [
            {
              id: "A1",
              connectorType: "Type 2",
              status: "available",
              lastUsed: "2024-12-25T14:30:00Z"
            },
            {
              id: "A2",
              connectorType: "Type 2",
              status: "occupied",
              currentBooking: "booking-123",
              lastUsed: "2024-12-26T08:15:00Z"
            },
            {
              id: "A3",
              connectorType: "Type 2",
              status: "available",
              lastUsed: "2024-12-25T16:45:00Z"
            }
          ]
        },
        {
          id: "post-B",
          name: "Trụ DC Nhanh",
          type: "DC",
          power: 50, // kW
          voltage: 400, // V
          totalSlots: 2,
          availableSlots: 2,
          slots: [
            {
              id: "B1",
              connectorType: "CCS2",
              status: "available",
              lastUsed: "2024-12-25T12:20:00Z"
            },
            {
              id: "B2",
              connectorType: "CCS2",
              status: "available",
              lastUsed: "2024-12-25T18:10:00Z"
            }
          ]
        },
        {
          id: "post-C",
          name: "Trụ DC Siêu nhanh",
          type: "DC",
          power: 150, // kW
          voltage: 800, // V
          totalSlots: 2,
          availableSlots: 1,
          slots: [
            {
              id: "C1",
              connectorType: "CCS2",
              status: "available",
              lastUsed: "2024-12-25T10:05:00Z"
            },
            {
              id: "C2",
              connectorType: "CHAdeMO",
              status: "maintenance",
              lastMaintenance: "2024-12-26T06:00:00Z"
            }
          ]
        }
      ],
      // Thống kê tổng quan
      totalPorts: 7, // Tổng tất cả slots
      availablePorts: 5, // Tổng slots available
      maxPower: 150, // Công suất cao nhất
      connectorTypes: ["Type 2", "CCS2", "CHAdeMO"], // Tất cả loại connector
      pricing: {
        acRate: 8500, // VND per kWh cho AC
        dcRate: 12000, // VND per kWh cho DC
        dcFastRate: 15000, // VND per kWh cho DC siêu nhanh
        parkingFee: 5000, // per hour
      },
    },
    ratings: {
      overall: 4.6,
      cleanliness: 4.8,
      availability: 4.2,
      speed: 4.7,
      totalReviews: 156,
    },
    images: [
      "/assets/stations/green-mall-1.jpg",
      "/assets/stations/green-mall-2.jpg",
    ],
  },
  {
    id: "station-002",
    ownerId: "system",
    name: "Tech Park SuperCharger",
    type: "semi-private",
    status: "active",
    location: {
      address: "456 Đường Lê Thánh Tôn, Quận 1, Thành phố Hồ Chí Minh",
      coordinates: { lat: 10.7837, lng: 106.6956 },
      landmarks: ["Bitexco Financial Tower", "Nguyen Hue Boulevard"],
    },

    operatingHours: {
      open: "05:30",
      close: "23:30",
      timezone: "Asia/Ho_Chi_Minh",
    },
    charging: {
      // Trụ sạc (Charging Posts) - Tech Park focus on DC Fast
      chargingPosts: [
        {
          id: "post-D",
          name: "Trụ DC Ultra",
          type: "DC",
          power: 250, // kW
          voltage: 800, // V
          totalSlots: 3,
          availableSlots: 3,
          slots: [
            {
              id: "D1",
              connectorType: "CCS2",
              status: "available",
              lastUsed: "2024-12-25T20:30:00Z"
            },
            {
              id: "D2",
              connectorType: "CCS2",
              status: "available",
              lastUsed: "2024-12-25T19:15:00Z"
            },
            {
              id: "D3",
              connectorType: "CHAdeMO",
              status: "available",
              lastUsed: "2024-12-25T17:45:00Z"
            }
          ]
        },
        {
          id: "post-E",
          name: "Trụ DC Nhanh+",
          type: "DC",
          power: 120, // kW
          voltage: 400, // V
          totalSlots: 3,
          availableSlots: 3,
          slots: [
            {
              id: "E1",
              connectorType: "CCS2",
              status: "available",
              lastUsed: "2024-12-25T21:00:00Z"
            },
            {
              id: "E2",
              connectorType: "CCS2",
              status: "available",
              lastUsed: "2024-12-25T22:30:00Z"
            },
            {
              id: "E3",
              connectorType: "CHAdeMO",
              status: "available",
              lastUsed: "2024-12-25T16:20:00Z"
            }
          ]
        }
      ],
      // Thống kê tổng quan
      totalPorts: 6,
      availablePorts: 6,
      maxPower: 250,
      connectorTypes: ["CCS2", "CHAdeMO"],
      pricing: {
        dcRate: 15000, // Unified DC rate
        dcUltraRate: 18000, // Ultra fast DC rate
        parkingFee: 0,
      },
    },
    ratings: {
      overall: 4.9,
      cleanliness: 4.9,
      availability: 4.8,
      speed: 5.0,
      totalReviews: 89,
    },
    images: [
      "/assets/stations/tech-park-1.jpg",
      "/assets/stations/tech-park-2.jpg",
    ],
  },
  {
    id: "station-003",
    ownerId: "system",
    name: "EcoPark Charging Station",
    type: "public",
    status: "active",
    location: {
      address: "789 Đường Võ Văn Tần, Quận 3, Thành phố Hồ Chí Minh",
      coordinates: { lat: 10.7892, lng: 106.6844 },
      landmarks: ["Tao Dan Park", "War Remnants Museum"],
    },

    operatingHours: {
      open: "24/7",
      timezone: "Asia/Ho_Chi_Minh",
    },
    charging: {
      // Trụ sạc (Charging Posts) - EcoPark with mixed AC/DC
      chargingPosts: [
        {
          id: "post-F",
          name: "Trụ AC Eco",
          type: "AC",
          power: 11, // kW
          voltage: 400, // V (3-phase)
          totalSlots: 2,
          availableSlots: 1,
          slots: [
            {
              id: "F1",
              connectorType: "Type 2",
              status: "available",
              lastUsed: "2024-12-25T13:15:00Z"
            },
            {
              id: "F2",
              connectorType: "Type 2",
              status: "occupied",
              currentBooking: "booking-456",
              lastUsed: "2024-12-26T07:30:00Z"
            }
          ]
        },
        {
          id: "post-G",
          name: "Trụ DC Eco+",
          type: "DC",
          power: 100, // kW
          voltage: 500, // V
          totalSlots: 2,
          availableSlots: 0, // Fully occupied
          slots: [
            {
              id: "G1",
              connectorType: "CCS2",
              status: "occupied",
              currentBooking: "booking-789",
              lastUsed: "2024-12-26T09:00:00Z"
            },
            {
              id: "G2",
              connectorType: "CCS2",
              status: "occupied",
              currentBooking: "booking-101",
              lastUsed: "2024-12-26T08:45:00Z"
            }
          ]
        }
      ],
      // Thống kê tổng quan
      totalPorts: 4,
      availablePorts: 1,
      maxPower: 100,
      connectorTypes: ["Type 2", "CCS2"],
      pricing: {
        acRate: 7500,
        dcRate: 11000,
        parkingFee: 3000,
      },
    },
    ratings: {
      overall: 4.3,
      cleanliness: 4.5,
      availability: 3.8,
      speed: 4.2,
      totalReviews: 73,
    },
    images: ["/assets/stations/ecopark-1.jpg"],
  },
];

// =================================
// CHARGING SESSIONS & BOOKINGS
// =================================

export const mockBookings = [
  {
    id: "booking-001",
    customerId: "customer-001",
    stationId: "station-001",
    status: "completed",
    scheduledTime: "2024-03-15T08:30:00Z",
    actualStartTime: "2024-03-15T08:35:00Z",
    endTime: "2024-03-15T09:45:00Z",
    duration: 70, // minutes
    energyDelivered: 45.6, // kWh
    cost: {
      energyCost: 547200, // VND
      parkingCost: 10000,
      total: 557200,
    },
    payment: {
      method: "credit-card",
      transactionId: "txn-001",
      status: "paid",
    },
    rating: {
      overall: 5,
      comment: "Fast charging, clean facility!",
    },
  },
  {
    id: "booking-002",
    customerId: "customer-002",
    stationId: "station-002",
    status: "active",
    scheduledTime: "2024-03-15T16:00:00Z",
    actualStartTime: "2024-03-15T16:02:00Z",
    estimatedEndTime: "2024-03-15T17:15:00Z",
    currentEnergyDelivered: 28.3,
    estimatedCost: 424500,
  },
  {
    id: "booking-003",
    customerId: "customer-001",
    stationId: "station-003",
    status: "scheduled",
    scheduledTime: "2024-03-16T14:00:00Z",
    estimatedDuration: 60,
    estimatedCost: 350000,
  },
];

// =================================
// ANALYTICS & REPORTS DATA
// =================================

export const mockAnalytics = {
  systemOverview: {
    totalStations: 3,
    totalUsers: 4,
    activeCustomers: 2,
    totalRevenue: 2140000,
    monthlyGrowth: 15.2,
    averageSessionTime: 68,
    peakHours: ["08:00-09:00", "17:00-19:00"],
  },

  revenueData: [
    { month: "Jan 2024", revenue: 890000, sessions: 145 },
    { month: "Feb 2024", revenue: 1250000, sessions: 198 },
    { month: "Mar 2024", revenue: 1560000, sessions: 234 },
  ],

  stationUsage: [
    { stationId: "station-001", utilization: 78, revenue: 890000 },
    { stationId: "station-002", utilization: 85, revenue: 1250000 },
    { stationId: "station-003", utilization: 62, revenue: 560000 },
  ],

  customerBehavior: {
    averageSessionsPerMonth: 3.2,
    preferredChargingTimes: {
      morning: 35,
      afternoon: 25,
      evening: 40,
    },
    paymentMethods: {
      creditCard: 60,
      eWallet: 35,
      cash: 5,
    },
  },
};

// =================================
// PAYMENT METHODS
// =================================

export const mockPaymentMethods = [
  {
    id: "payment-001",
    customerId: "customer-001",
    type: "credit-card",
    provider: "visa",
    lastFour: "4567",
    expiryMonth: 12,
    expiryYear: 2026,
    isDefault: true,
    nickname: "Personal Visa",
  },
  {
    id: "payment-002",
    customerId: "customer-002",
    type: "e-wallet",
    provider: "momo",
    identifier: "+84906789012",
    isDefault: true,
    nickname: "MoMo Wallet",
  },
];

// =================================
// EXPORT ALL MOCK DATA
// =================================

export const mockData = {
  users: mockUsers,
  stations: mockStations,
  bookings: mockBookings,
  analytics: mockAnalytics,
  paymentMethods: mockPaymentMethods,
};

export default mockData;
