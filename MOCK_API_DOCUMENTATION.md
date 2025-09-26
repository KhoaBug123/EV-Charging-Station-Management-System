# 🚀 Mock API Documentation - SOC & QR Scanner

## 📋 Tổng quan
Mock API system hoàn chỉnh cho SOC tracking và QR scanner, mô phỏng real-time charging experience.

## 🔌 SOC Tracking API

### `socAPI.initializeSOCSession(bookingId, vehicleData)`
Khởi tạo phiên tracking SOC cho một booking.

**Parameters:**
```javascript
{
  bookingId: "string",
  vehicleData: {
    initialSOC: 25,        // % (optional, default: random 20-70%)
    targetSOC: 80,         // % (optional, default: 80%)
    batteryCapacity: 60,   // kWh (optional, default: 60)
    vehicleId: "string"    // (optional, auto-generated)
  }
}
```

**Returns:**
```javascript
{
  success: true,
  data: {
    bookingId: "string",
    vehicleId: "string",
    batteryCapacity: 60,
    initialSOC: 35.2,
    currentSOC: 35.2,
    targetSOC: 80,
    startTime: "2024-12-26T...",
    lastUpdated: "2024-12-26T...",
    chargingRate: 0,
    estimatedTimeToTarget: null,
    status: "connected",
    chargingHistory: []
  }
}
```

### `socAPI.startCharging(bookingId)`
Bắt đầu quá trình sạc.

**Returns:** Session data với `status: "charging"`

### `socAPI.updateSOC(bookingId, chargingData)`
Cập nhật SOC dựa trên dữ liệu sạc.

**Parameters:**
```javascript
{
  powerDelivered: 50,    // kW
  voltage: 400,          // V
  current: 125,          // A
  temperature: 35        // °C
}
```

**Features:**
- ✅ Realistic charging curve (slower at high SOC)
- ✅ Auto-calculate charging rate (%/hour)
- ✅ Estimated time to target
- ✅ Charging history tracking
- ✅ Auto-completion when target reached

### `socAPI.simulateRealTimeUpdates(bookingId, callback)`
Mô phỏng real-time updates mỗi 3 giây.

**Usage:**
```javascript
const interval = mockAPI.soc.simulateRealTimeUpdates(bookingId, (updatedSession) => {
  console.log('SOC updated:', updatedSession.currentSOC + '%');
  // Update UI with new data
});

// Clean up
clearInterval(interval);
```

## 📱 QR Scanner API

### `qrAPI.validateQRCode(qrData)`
Validate QR code và trả về thông tin trạm/port.

**QR Format:** `"SKAEV:STATION:{stationId}:{portId}"`

**Returns:**
```javascript
{
  success: true,
  data: {
    stationId: "station-001",
    station: {...}, // Full station object
    portId: "A01",
    portInfo: {
      available: true,
      status: "available",
      connector: {
        type: "CCS2",
        maxPower: 150
      },
      maintenanceStatus: "operational"
    },
    timestamp: "2024-12-26T..."
  }
}
```

### `qrAPI.createQRBooking(qrData, userPreferences)`
Tạo booking tự động từ QR scan.

**Parameters:**
```javascript
{
  qrData: "SKAEV:STATION:station-001:A01",
  userPreferences: {
    userId: "string",
    targetSOC: 85,        // % (optional)
    batteryCapacity: 75   // kWh (optional)
  }
}
```

**Returns:**
```javascript
{
  success: true,
  data: {
    booking: {...},      // Created booking object
    station: {...},      // Station details
    portId: "A01",
    autoInitiated: true
  }
}
```

### `qrAPI.generateStationQR(stationId, portId)`
Generate QR codes cho trạm sạc.

**Returns:** Array of QR codes với images và data

## 🎯 Usage Examples

### 1. Complete QR to Charging Flow
```javascript
// 1. Scan QR and create booking
const qrResult = await mockAPI.qr.createQRBooking(
  "SKAEV:STATION:station-001:A01",
  { userId: "user123", targetSOC: 85 }
);

// 2. Initialize SOC tracking
const socSession = await mockAPI.soc.initializeSOCSession(
  qrResult.data.booking.id,
  { initialSOC: 30, targetSOC: 85, batteryCapacity: 60 }
);

// 3. Start charging
await mockAPI.soc.startCharging(qrResult.data.booking.id);

// 4. Real-time updates
const interval = mockAPI.soc.simulateRealTimeUpdates(
  qrResult.data.booking.id,
  (session) => {
    updateUI(session.currentSOC, session.chargingRate);
  }
);
```

### 2. Manual SOC Tracking
```javascript
// Initialize session
const session = await mockAPI.soc.initializeSOCSession("booking123", {
  initialSOC: 25,
  targetSOC: 80,
  batteryCapacity: 75
});

// Start charging
await mockAPI.soc.startCharging("booking123");

// Manual updates with sensor data
await mockAPI.soc.updateSOC("booking123", {
  powerDelivered: 55,
  voltage: 395,
  current: 140,
  temperature: 38
});

// Get current status
const status = await mockAPI.soc.getSOCStatus("booking123");
console.log(`Current SOC: ${status.data.currentSOC}%`);
```

## 🔧 Integration với Components

### ChargingStatus Component
```javascript
// Sử dụng API thay vì local store
useEffect(() => {
  const initSOC = async () => {
    await mockAPI.soc.initializeSOCSession(bookingId, vehicleData);
    const interval = mockAPI.soc.simulateRealTimeUpdates(bookingId, setSocData);
    return () => clearInterval(interval);
  };
  
  initSOC();
}, [bookingId]);
```

### QRCodeScanner Component
```javascript
const handleScan = async (qrData) => {
  try {
    const result = await mockAPI.qr.createQRBooking(qrData, userPrefs);
    onScanSuccess(result.data);
  } catch (error) {
    setError(error.message);
  }
};
```

## 🎮 Demo Page
Access: `http://localhost:5173/api-demo`

**Features:**
- ✅ Test QR validation và booking creation
- ✅ SOC session management với real-time updates
- ✅ Charging simulation với realistic curves
- ✅ API call logs và error handling
- ✅ Visual SOC progress với circular indicators

## 📊 Mock Data Features

### Realistic Charging Behavior
- **Fast charging**: 20-60 kW power delivery
- **Charging curve**: Slower at high SOC (>80%)
- **Temperature simulation**: 30-45°C realistic range
- **Voltage/Current**: Proper electrical parameters

### QR Code Validation
- **Format checking**: SKAEV protocol validation
- **Station lookup**: Real station data integration  
- **Port availability**: Dynamic port status
- **Error scenarios**: Proper error messages

### Real-time Updates
- **3-second intervals**: Smooth SOC progression
- **Auto-completion**: Stops at target SOC
- **History tracking**: Complete charging session data
- **Callback system**: Easy UI integration

## 🚀 Next Steps
1. **WebSocket integration**: Replace intervals with real-time streams
2. **Vehicle API**: Connect to actual car data
3. **Payment processing**: Add payment mock APIs
4. **Notifications**: Push notification simulation
5. **Analytics**: Usage patterns and statistics

---

**Ready for production integration! 🎉**