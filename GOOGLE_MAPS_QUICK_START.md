# 🗺️ Google Maps Integration - Quick Start

## ✅ Setup nhanh (5 phút)

### Bước 1: Lấy API Key
1. Vào https://console.cloud.google.com/
2. Tạo project → APIs & Services → Credentials
3. Create API Key
4. Bật **Maps JavaScript API**

### Bước 2: Cấu hình
Mở `.env.development` và thêm:
```env
VITE_GOOGLE_MAPS_API_KEY=AIzaSy...your-key
```

### Bước 3: Chạy thử
```bash
npm run dev
```

Truy cập: http://localhost:5173/map-demo

## 🎯 Sử dụng

### Import component
```jsx
import StationMapGoogle from '../components/customer/StationMapGoogle';
```

### Basic usage
```jsx
<StationMapGoogle
  stations={stations}
  onStationSelect={(s) => console.log(s)}
  onBookingClick={(s) => handleBooking(s)}
  height="600px"
/>
```

## 📚 Docs đầy đủ

Xem file `GOOGLE_MAPS_GUIDE.md` để biết thêm chi tiết.

## 🆚 So sánh

| Feature | Google Maps | Leaflet |
|---------|------------|---------|
| Miễn phí | $200/tháng credit | ✅ Hoàn toàn |
| Chất lượng data | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Chỉ đường | ✅ Built-in | ❌ Cần plugin |
| Street View | ✅ | ❌ |
| API Key | Cần | Không cần |

## 🎨 Features

- ✅ Custom markers (xanh/đỏ theo trạng thái)
- ✅ Info windows với đầy đủ thông tin
- ✅ Auto-detect vị trí user
- ✅ Tìm trạm gần nhất
- ✅ Chỉ đường Google Maps
- ✅ Responsive design
- ✅ Loading states
- ✅ Error handling

## 🔧 Troubleshooting

**Map blank?**
→ Check API key và bật Maps JavaScript API

**Markers không hiển thị?**
→ Check data format: `{lat: number, lng: number}`

**CORS error?**
→ Thêm domain vào API restrictions

---

Created: Oct 8, 2025 | v1.0.0
