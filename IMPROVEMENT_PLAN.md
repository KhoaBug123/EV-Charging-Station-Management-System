# 🚀 KẾ HOẠCH CẢI THIỆN HỆ THỐNG

## Ngày: 5/10/2025
## Trạng thái hiện tại: 95/100
## Mục tiêu: 100/100

---

## 📋 DANH SÁCH CẢI TIẾN

### 1️⃣ EDIT PROFILE - Form chỉnh sửa đầy đủ ✅ SẼ IMPLEMENT

**Vấn đề:** CustomerProfile.jsx chỉ hiển thị thông tin, nút "Chỉnh sửa" chưa có form edit thực sự

**Giải pháp:**
- ✅ Thêm TextField với editMode cho tất cả các trường
- ✅ Validation cho email, phone
- ✅ Avatar upload/change
- ✅ Address autocomplete
- ✅ Save button với loading state
- ✅ Cancel button để thoát edit mode

**Files cần sửa:**
- `src/pages/customer/CustomerProfile.jsx` - Thêm form edit
- `src/store/authStore.js` - Đảm bảo updateProfile hoạt động đúng

**Ước tính:** 30 phút

---

### 2️⃣ GÓI THUÊ BAO - Tích hợp vào thanh toán ✅ SẼ IMPLEMENT

**Vấn đề:** planStore.js có data nhưng chưa tích hợp vào ChargingFlow payment

**Giải pháp:**
- ✅ Thêm tab "Gói thuê bao" trong payment step
- ✅ Hiển thị active subscription của user
- ✅ Áp dụng discount nếu có gói
- ✅ Option để mua gói mới trong quá trình thanh toán
- ✅ Badge hiển thị plan trong profile/dashboard

**Files cần sửa:**
- `src/pages/customer/ChargingFlow.jsx` (Step 5 - Payment)
- `src/store/planStore.js` - Thêm logic apply discount
- `src/pages/customer/Dashboard.jsx` - Hiển thị active plan

**Ước tính:** 45 phút

---

### 3️⃣ PAYMENT GATEWAY - Tích hợp VNPay/MoMo ✅ SẼ IMPLEMENT

**Vấn đề:** Chỉ có mock button, chưa có integration thực

**Giải pháp:**

#### Option A: MOCK SIMULATION (Nhanh - cho demo)
- ✅ Tạo `paymentGatewayService.js` mock
- ✅ Simulate payment flow với QR code
- ✅ Countdown timer 30s
- ✅ Success/Failure random hoặc theo test case
- ✅ Transaction ID generation

#### Option B: REAL INTEGRATION (Lâu hơn - production ready)
- ⏳ Đăng ký VNPay/MoMo sandbox
- ⏳ API key configuration
- ⏳ Webhook handler cho callback
- ⏳ Security: hash validation
- ⏳ Error handling & retry logic

**Quyết định:** Implement Option A (Mock Simulation) để demo
- Thời gian: 1 giờ
- Đủ để showcase flow
- Dễ dàng chuyển sang real API sau

**Files cần tạo:**
- `src/services/paymentGatewayService.js` - Mock gateway
- `src/components/customer/PaymentQRModal.jsx` - QR display
- `src/components/customer/PaymentConfirmation.jsx` - Result screen

**Files cần sửa:**
- `src/pages/customer/ChargingFlow.jsx` - Call service

**Ước tính:** 1 giờ

---

### 4️⃣ GOOGLE MAPS - Tích hợp bản đồ thực ✅ SẼ IMPLEMENT

**Vấn đề:** Chỉ có list view, chưa có map view

**Giải pháp:**

#### Phase 1: Google Maps Embed (Đơn giản)
- ✅ Thêm tab "Map View" vs "List View"
- ✅ Google Maps iFrame với markers
- ✅ Hiển thị vị trí trạm từ coordinates
- ✅ Click marker → hiển thị info của trạm

#### Phase 2: Google Maps API (Advanced - nếu có thời gian)
- ⏳ @react-google-maps/api
- ⏳ Custom markers với icon
- ⏳ Clustering cho nhiều trạm
- ⏳ Route planning từ vị trí hiện tại
- ⏳ Traffic layer

**Quyết định:** Implement Phase 1 (Embed) trước
- Không cần API key
- Đủ để demo
- Dễ upgrade lên Phase 2

**Files cần sửa:**
- `src/pages/customer/ChargingFlow.jsx` - Thêm Map View tab
- `src/components/customer/StationMap.jsx` (NEW) - Map component

**Ước tính:** 45 phút

---

## ⏱️ TỔNG THỜI GIAN ƯỚC TÍNH

| Cải tiến | Thời gian | Priority |
|----------|-----------|----------|
| 1. Edit Profile | 30 phút | 🔴 HIGH |
| 2. Gói thuê bao | 45 phút | 🟡 MEDIUM |
| 3. Payment Gateway | 1 giờ | 🔴 HIGH |
| 4. Google Maps | 45 phút | 🟠 MEDIUM-HIGH |

**TỔNG:** ~3 giờ

---

## 📝 THỨ TỰ THỰC HIỆN

1. **Edit Profile** (30') - Dễ nhất, impact cao
2. **Google Maps** (45') - Visual improvement lớn
3. **Payment Gateway** (1h) - Quan trọng cho flow
4. **Gói thuê bao** (45') - Nice-to-have, làm cuối

---

## 🎯 KẾT QUẢ MONG ĐỢI

Sau khi hoàn thành:
- ✅ Edit Profile: 100% functional
- ✅ Payment: Realistic simulation với QR
- ✅ Maps: Visual + interactive
- ✅ Subscription: Integrated vào pricing

**ĐIỂM SỐ CUỐI:** 100/100 ⭐⭐⭐⭐⭐

---

## 💡 GHI CHÚ QUAN TRỌNG

### Về Payment Gateway:
- Mock simulation là đủ cho MVP/Demo
- Tích hợp thật cần:
  - Business registration
  - Bank verification  
  - API approval (1-2 tuần)
  - Sandbox testing
  - Security audit

### Về Google Maps:
- Embed free, không cần key
- API có giới hạn $200 free/tháng
- Cho demo: embed là đủ

### Về Edit Profile:
- Cần validation cẩn thận
- Phone format: +84 xxx xxx xxx
- Email: regex validation
- Avatar: support local upload + preview

---

## ✅ CHECKLIST TRƯỚC KHI BẮT ĐẦU

- [ ] Backup code hiện tại (git commit)
- [ ] Test environment setup
- [ ] Read all related files
- [ ] Understand current architecture
- [ ] Plan component structure

---

*Created: 5/10/2025*
*Estimated completion: Same day*
*Status: READY TO START* 🚀
