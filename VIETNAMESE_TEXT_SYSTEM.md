# Hệ thống Đồng bộ Tiếng Việt - SkaEV

Tài liệu này mô tả hệ thống quản lý văn bản tiếng Việt thống nhất cho ứng dụng SkaEV.

## 📋 Tổng quan

Dự án đã được cập nhật để sử dụng hệ thống văn bản tiếng Việt thống nhất, giúp:

- ✅ Đồng bộ tất cả văn bản giao diện sang tiếng Việt
- ✅ Dễ dàng quản lý và cập nhật văn bản
- ✅ Hỗ trợ đa ngôn ngữ trong tương lai
- ✅ Tránh lỗi chính tả và không nhất quán

## 🏗️ Cấu trúc Hệ thống

### 1. File cấu hình văn bản chính
```
src/utils/vietnameseTexts.js
```
Chứa toàn bộ văn bản tiếng Việt được tổ chức theo modules:

- `common` - Văn bản chung (lưu, hủy, tìm kiếm, v.v.)
- `auth` - Xác thực (đăng nhập, đăng ký)
- `nav` - Điều hướng và menu
- `home` - Trang chủ
- `stations` - Quản lý trạm sạc
- `booking` - Đặt chỗ
- `users` - Quản lý người dùng
- `errors` - Thông báo lỗi
- `success` - Thông báo thành công
- `time` - Thời gian
- `units` - Đơn vị đo lường

### 2. Hook tiện ích
```
src/hooks/useVietnameseText.js
```
Hook React để sử dụng văn bản tiếng Việt dễ dàng hơn.

## 🚀 Cách sử dụng

### 1. Sử dụng trực tiếp

```jsx
import { getText, formatText } from '../utils/vietnameseTexts';

// Lấy văn bản đơn giản
const loginText = getText('auth.login'); // "Đăng nhập"

// Lấy văn bản với biến
const welcomeText = formatText('nav.welcome', { name: 'John' }); // "Chào mừng, John"
```

### 2. Sử dụng với Hook (Khuyến nghị)

```jsx
import { useVietnameseText } from '../hooks/useVietnameseText';

const MyComponent = () => {
  const { t, tf } = useVietnameseText();

  return (
    <div>
      <h1>{t('home.title')}</h1>
      <p>{tf('stations.bookingSuccess', { 
        stationName: 'Trạm A', 
        bookingId: '12345' 
      })}</p>
    </div>
  );
};
```

## 📝 Quy tắc đặt tên

### Cấu trúc key văn bản:
```
module.context.item
```

**Ví dụ:**
- `auth.login` - Nút đăng nhập
- `home.features.fastCharging.title` - Tiêu đề tính năng sạc nhanh
- `errors.emailRequired` - Lỗi email bắt buộc
- `success.profileUpdated` - Thông báo cập nhật thành công

### Quy tắc đặt tên:
- Sử dụng `camelCase` cho tên key
- Tên phải mô tả rõ ràng nội dung
- Nhóm theo module logic
- Sử dụng tiếng Anh cho key, tiếng Việt cho value

## 🔧 Thêm văn bản mới

### 1. Thêm vào file chính

```javascript
// src/utils/vietnameseTexts.js
export const VIETNAMESE_TEXTS = {
  // ... existing texts
  myModule: {
    myText: "Văn bản mới",
    myTextWithVar: "Xin chào {name}",
  }
};
```

### 2. Sử dụng trong component

```jsx
import { getText } from '../utils/vietnameseTexts';

const text = getText('myModule.myText');
```

## 📱 Các trang đã cập nhật

### ✅ Hoàn thành
- **Trang chủ** (`/`) - Hoàn toàn tiếng Việt
- **Đăng nhập** (`/login`) - Hoàn toàn tiếng Việt
- **Đăng ký** (`/register`) - Hoàn toàn tiếng Việt
- **Header & Navigation** - Hoàn toàn tiếng Việt
- **Sidebar** - Hoàn toàn tiếng Việt
- **Tìm trạm sạc** (`/customer/find-stations`) - Hoàn toàn tiếng Việt

### 🔄 Cần cập nhật (tùy chọn)
- Các trang admin (Dashboard, User Management, v.v.)
- Các trang staff (Dashboard, Station Management, v.v.)
- Các trang customer khác (Booking History, Payment, Profile)
- Các modal và dialog

## 🎯 Ví dụ thực tế

### Before (Trước khi cập nhật):
```jsx
<Button>Login</Button>
<Typography>Find Charging Stations</Typography>
<Chip label="Available" />
```

### After (Sau khi cập nhật):
```jsx
<Button>{getText('auth.login')}</Button>
<Typography>{getText('stations.title')}</Typography>
<Chip label={getText('stations.available')} />
```

## 🚀 Chạy ứng dụng

```bash
# Cài đặt dependencies
npm install --legacy-peer-deps

# Chạy development server
npm run dev

# Mở trình duyệt
# http://localhost:5173
```

## 📋 Danh sách văn bản có sẵn

### Authentication (auth)
- `login`, `logout`, `register`
- `email`, `password`, `confirmPassword`
- `firstName`, `lastName`, `phone`
- `loginSuccess`, `registerSuccess`

### Navigation (nav)
- `dashboard`, `findStations`, `bookingHistory`
- `paymentMethods`, `profile`, `settings`
- `userManagement`, `stationManagement`

### Home Page (home)
- `title`, `subtitle`, `whyChoose`
- `features.*`, `stats.*`
- `readyToStart`, `copyright`

### Stations (stations)
- `title`, `subtitle`, `searchPlaceholder`
- `available`, `full`, `offline`
- `bookNow`, `bookThisStation`
- `chargingInfo`, `pricing`

### Common (common)
- `loading`, `save`, `cancel`, `delete`
- `search`, `filter`, `back`, `next`
- `success`, `error`, `warning`

## 🔄 Mở rộng tương lai

Hệ thống đã được thiết kế để dễ dàng:

1. **Thêm ngôn ngữ mới** - Tạo file tương tự cho tiếng Anh, Nhật, v.v.
2. **Quản lý từ xa** - Có thể tích hợp với API để load văn bản từ server
3. **A/B Testing** - Test nhiều phiên bản văn bản khác nhau
4. **Tự động hóa** - Script để kiểm tra văn bản thiếu hoặc không sử dụng

## 📞 Hỗ trợ

Nếu bạn cần thêm văn bản mới hoặc có thắc mắc về hệ thống:

1. Thêm văn bản vào `src/utils/vietnameseTexts.js`
2. Sử dụng `getText()` hoặc hook `useVietnameseText()`
3. Test trên giao diện để đảm bảo hiển thị đúng

---

**Lưu ý:** Tất cả văn bản trong ứng dụng hiện tại đều đã được đồng bộ sang tiếng Việt và sử dụng hệ thống quản lý văn bản thống nhất.