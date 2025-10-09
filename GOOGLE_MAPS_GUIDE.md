# 🗺️ Google Maps Integration Guide

## 📋 Tổng quan

Component `StationMapGoogle` sử dụng Google Maps API để hiển thị bản đồ trạm sạc với các tính năng nâng cao.

## 🔑 Cấu hình API Key

### Bước 1: Lấy Google Maps API Key

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project có sẵn
3. Vào **APIs & Services > Credentials**
4. Click **Create Credentials > API Key**
5. Copy API key vừa tạo

### Bước 2: Bật Maps JavaScript API

1. Vào **APIs & Services > Library**
2. Tìm kiếm "Maps JavaScript API"
3. Click **Enable**

### Bước 3: Cấu hình trong project

Mở file `.env.development` và thêm:

```env
VITE_GOOGLE_MAPS_API_KEY=AIzaSy...your-actual-api-key-here
```

**⚠️ Lưu ý:** 
- KHÔNG commit API key lên Git
- Thêm `.env.development` vào `.gitignore`
- Sử dụng API key restrictions trong production

## 📦 Dependencies

Package đã cài đặt:
```json
{
  "@vis.gl/react-google-maps": "^1.x.x"
}
```

## 🎨 Sử dụng Component

### Import

```jsx
import StationMapGoogle from '../components/customer/StationMapGoogle';
```

### Basic Usage

```jsx
<StationMapGoogle
  stations={stations}
  onStationSelect={(station) => console.log('Selected:', station)}
  onBookingClick={(station) => handleBooking(station)}
  height="600px"
/>
```

### Full Example

```jsx
import React, { useState } from 'react';
import StationMapGoogle from '../components/customer/StationMapGoogle';

function ChargingStations() {
  const [selectedStation, setSelectedStation] = useState(null);

  const stations = [
    {
      id: 'st-001',
      name: 'Green Mall Charging Hub',
      location: {
        coordinates: { lat: 10.7769, lng: 106.7009 },
        address: '123 Nguyễn Huệ, Q1, HCM'
      },
      operatingHours: '24/7',
      charging: {
        chargingPosts: [
          {
            type: 'AC',
            power: 7,
            totalSlots: 2,
            availableSlots: 1
          }
        ],
        pricing: {
          acRate: 8500,
          dcRate: 12000
        }
      }
    }
  ];

  return (
    <StationMapGoogle
      stations={stations}
      selectedStation={selectedStation}
      onStationSelect={setSelectedStation}
      onBookingClick={(station) => {
        console.log('Booking for:', station.name);
      }}
      userLocation={{ lat: 10.8231, lng: 106.6297 }}
      height="calc(100vh - 200px)"
      showControls={true}
    />
  );
}
```

## 🎯 Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `stations` | Array | `[]` | Danh sách trạm sạc |
| `selectedStation` | Object | `null` | Trạm đang được chọn |
| `onStationSelect` | Function | `() => {}` | Callback khi chọn trạm |
| `onBookingClick` | Function | `() => {}` | Callback khi click đặt chỗ |
| `userLocation` | Object | `null` | Vị trí user `{lat, lng}` |
| `height` | String | `'600px'` | Chiều cao map |
| `showControls` | Boolean | `true` | Hiển thị controls |

## ✨ Tính năng

### 1. Custom Markers
- 🟢 Marker xanh: Trạm có chỗ trống
- 🔴 Marker đỏ: Trạm hết chỗ
- 🔵 Marker xanh dương: Vị trí người dùng
- Icon EV Station cho dễ nhận biết

### 2. Interactive Info Window
- Tên và trạng thái trạm
- Địa chỉ đầy đủ
- Giờ hoạt động
- Số cổng sạc trống/tổng số
- Loại sạc và công suất
- Giá sạc AC/DC
- Nút "Chỉ đường" - mở Google Maps
- Nút "Đặt chỗ" - trigger booking

### 3. User Location
- Auto-detect vị trí người dùng
- Button "Vị trí của tôi" (GPS icon)
- Button "Trạm gần nhất" (Navigation icon)
- Pan to user location

### 4. Map Controls
- Zoom in/out
- Pan/drag
- Gesture handling (greedy mode)
- Fullscreen (nếu bật)
- Street view (nếu bật)

### 5. UI Elements
- Station counter (bottom left)
- Floating action buttons (top right)
- Error alerts (bottom center)
- Loading indicators

## 🎨 Customization

### Thay đổi màu marker

```jsx
// Trong StationMarker component
const pinColor = hasAvailableSlots ? '#4CAF50' : '#F44336';
// Đổi thành màu bạn muốn
```

### Thay đổi default center

```jsx
const VIETNAM_CENTER = { lat: 10.8231, lng: 106.6297 }; // HCM
// Hoặc Hà Nội
const HANOI_CENTER = { lat: 21.0285, lng: 105.8542 };
```

### Thêm map styles (dark mode, custom colors)

```jsx
<Map
  mapId="skaev-charging-stations-map"
  styles={darkModeStyles} // Thêm custom styles
  ...
/>
```

## 🔄 Migration từ Leaflet

Thay thế component cũ:

```jsx
// Cũ
import StationMapLeaflet from './StationMapLeaflet';

// Mới
import StationMapGoogle from './StationMapGoogle';

// Props tương tự, chỉ cần đổi tên component
<StationMapGoogle {...props} />
```

## 🐛 Troubleshooting

### API Key không hoạt động
```
Error: Google Maps JavaScript API error: ApiNotActivatedMapError
```
**Fix:** Bật Maps JavaScript API trong Google Cloud Console

### CORS Error
```
Error: Cross-Origin Request Blocked
```
**Fix:** Thêm domain vào API key restrictions

### Map không hiển thị
```
Map shows blank/grey
```
**Fix:** 
1. Check API key đúng chưa
2. Check billing account enabled chưa
3. Check console có error không

### Marker không hiển thị
```
Markers not showing
```
**Fix:**
1. Check `stations` array có data không
2. Check coordinates format: `{lat: number, lng: number}`
3. Check zoom level (nên >= 10)

## 📊 Performance Tips

### 1. Lazy Loading
```jsx
import { lazy, Suspense } from 'react';

const StationMapGoogle = lazy(() => import('./StationMapGoogle'));

<Suspense fallback={<Loading />}>
  <StationMapGoogle {...props} />
</Suspense>
```

### 2. Memoization
```jsx
const memoizedStations = useMemo(() => stations, [stations]);

<StationMapGoogle stations={memoizedStations} />
```

### 3. Debounce Search
```jsx
const debouncedSearch = useMemo(
  () => debounce((value) => setSearchTerm(value), 300),
  []
);
```

## 🔐 Security Best Practices

### 1. API Key Restrictions

**Application restrictions:**
- HTTP referrers: `yourdomain.com/*`
- IP addresses (cho server)

**API restrictions:**
- Chỉ bật APIs cần thiết:
  - Maps JavaScript API
  - Places API (nếu cần autocomplete)
  - Directions API (nếu cần routing)

### 2. Environment Variables

```env
# Development
VITE_GOOGLE_MAPS_API_KEY=AIza...dev-key

# Production (trong CI/CD)
VITE_GOOGLE_MAPS_API_KEY=AIza...prod-key
```

### 3. Rate Limiting

Google Maps có giới hạn:
- 25,000 map loads/day (miễn phí)
- $7 per 1,000 loads sau đó

## 🚀 Advanced Features (Tương lai)

### 1. Clustering
Khi có nhiều markers:
```jsx
import { MarkerClusterer } from '@googlemaps/markerclusterer';
```

### 2. Directions
Hiển thị route từ user đến trạm:
```jsx
import { DirectionsService, DirectionsRenderer } from '@vis.gl/react-google-maps';
```

### 3. Places Autocomplete
Search địa điểm:
```jsx
import { Autocomplete } from '@vis.gl/react-google-maps';
```

### 4. Heat Map
Hiển thị mật độ trạm:
```jsx
import { HeatmapLayer } from '@vis.gl/react-google-maps';
```

## 📚 Resources

- [Official Docs](https://visgl.github.io/react-google-maps/)
- [Google Maps API](https://developers.google.com/maps/documentation)
- [Examples](https://visgl.github.io/react-google-maps/examples)
- [GitHub](https://github.com/visgl/react-google-maps)

## 💡 Tips

1. **Development:** Sử dụng API key riêng cho dev và prod
2. **Testing:** Mock Google Maps API trong tests
3. **Mobile:** Test gesture handling trên mobile
4. **Accessibility:** Thêm ARIA labels cho controls
5. **SEO:** Server-side render static map cho SEO

## ❓ FAQ

**Q: Có cần billing account không?**
A: Có, nhưng Google cho $200 credit/tháng (miễn phí cho usage thấp)

**Q: Leaflet vs Google Maps?**
A: 
- Leaflet: Miễn phí, open source, nhẹ hơn
- Google: Nhiều tính năng, data tốt hơn, có Places/Directions

**Q: Có thể dùng offline không?**
A: Google Maps cần internet. Leaflet có thể dùng offline tiles.

**Q: Performance vs Leaflet?**
A: Tương đương. Google Maps optimize rất tốt cho large datasets.

---

**Created:** October 8, 2025
**Version:** 1.0.0
**Author:** SkaEV Development Team
