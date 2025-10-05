# 🎬 HƯỚNG DẪN TEST NHANH - 5 PHÚT

## 🚀 START SERVER

```bash
npm run dev
# Mở: http://localhost:5174
```

---

## ✅ TEST 1: EDIT PROFILE (1 phút)

### Steps:
1. Navigate to: `http://localhost:5174/customer/profile`
2. Click tab **"HỒ SƠ CÁ NHÂN"**
3. Click button **"Chỉnh sửa"**
4. Test validation:
   ```
   Phone: "123" → ❌ Error: "Số điện thoại không hợp lệ"
   Phone: "0901234567" → ✅ Valid
   ```
5. Click **"Lưu thay đổi"**
6. **Expected:** ✅ Alert "Cập nhật thông tin thành công!"

### Screenshots to take:
- [ ] Before edit (disabled fields)
- [ ] Edit mode with error
- [ ] Edit mode with valid data
- [ ] Success alert

---

## 🔔 TEST 2: PUSH NOTIFICATIONS (2 phút)

### A. Request Permission
1. Navigate to: `http://localhost:5174/notification-demo`
2. Click **"Cấp quyền thông báo"**
3. Browser prompt → Click **"Allow"**
4. **Expected:** ✅ Status changes to "granted"

### B. Test Notifications
5. Click **"Đặt chỗ thành công"** button
6. **Expected:**
   - ✅ Push notification hiện góc phải desktop
   - ✅ Badge count tăng ở header (chuông)
   - ✅ In-app notification trong dropdown

7. Click icon chuông ở header
8. **Expected:**
   - ✅ Dropdown menu hiện
   - ✅ List notifications
   - ✅ Badge "1 mới"

9. Click vào notification trong list
10. **Expected:**
    - ✅ Mark as read (badge giảm)
    - ✅ Navigate to history page

### Screenshots to take:
- [ ] Permission request prompt
- [ ] Push notification (desktop)
- [ ] Badge count (header)
- [ ] Dropdown menu
- [ ] Notification detail

---

## 📅 TEST 3: AUTO NOTIFICATION - BOOKING (1 phút)

### Steps:
1. Navigate to: `http://localhost:5174/customer/charging-flow`
2. Click **"Đặt chỗ"** on any station
3. Complete 4-step wizard:
   - Step 1: Select "Trụ A01" → Next
   - Step 2: Select "Cổng 1" → Next
   - Step 3: Select "Sạc ngay" → Next
   - Step 4: Check "Đồng ý" → Confirm
4. **Expected:**
   - ✅ Success message: "Đặt lịch thành công!"
   - ✅ **AUTO NOTIFICATION:** "✅ Đặt chỗ thành công"
   - ✅ Badge count tăng

### Screenshots to take:
- [ ] Step 1: Charging post selection
- [ ] Step 4: Confirmation
- [ ] Success message
- [ ] Auto notification appeared

---

## ⚡ TEST 4: AUTO NOTIFICATION - CHARGING (1 phút)

### Steps:
1. Navigate to: `http://localhost:5174/customer/history`
2. Find newest booking → Click **"Quét QR"**
3. Click **"Quét mã QR"** (simulation)
4. Wait 2 seconds → Click **"Bắt đầu sạc"**
5. **Expected:**
   - ✅ Success: "🔋 Đang sạc xe!"
   - ✅ **AUTO NOTIFICATION:** "🔋 Bắt đầu sạc xe"
   - ✅ Badge count tăng

### Screenshots to take:
- [ ] QR scanner modal
- [ ] Charging started success
- [ ] Auto notification appeared
- [ ] Badge updated

---

## 🎯 EXPECTED RESULTS SUMMARY

### Edit Profile:
```
✅ Validation works (red border + error text)
✅ Save success shows alert
✅ Cancel resets data
✅ No console errors
```

### Notifications:
```
✅ Permission request works
✅ Push notifications show (desktop)
✅ Badge count accurate
✅ Dropdown menu functional
✅ Mark as read works
✅ Delete works
✅ Auto-trigger on booking
✅ Auto-trigger on charging
```

---

## 📸 SCREENSHOT CHECKLIST

### Must-have screenshots:
- [ ] 1. Profile edit mode with validation error
- [ ] 2. Profile save success alert
- [ ] 3. Browser permission prompt
- [ ] 4. Push notification (desktop)
- [ ] 5. Notification badge (header)
- [ ] 6. Notification dropdown menu
- [ ] 7. Booking success + auto notification
- [ ] 8. QR charging + auto notification
- [ ] 9. Notification demo page
- [ ] 10. Full notification list

---

## 🐛 TROUBLESHOOTING

### If notification permission denied:
```bash
# Chrome: Settings → Privacy → Site Settings → Notifications
# Allow: http://localhost:5174
```

### If badge not updating:
```bash
# Hard refresh: Ctrl + Shift + R
# Clear cache
```

### If validation not showing:
```bash
# Check console for errors
# Ensure you're in edit mode (button shows "Lưu thay đổi")
```

---

## ⏱️ TIME ESTIMATE

| Test | Time |
|------|------|
| Edit Profile | 1 min |
| Notification Demo | 2 min |
| Auto Booking Notify | 1 min |
| Auto Charging Notify | 1 min |
| **Total** | **5 min** |

---

## ✅ COMPLETION CHECKLIST

After testing, verify:
- [ ] All features work as expected
- [ ] No console errors
- [ ] Screenshots taken
- [ ] Ready for demo presentation

---

**Good luck! Chúc demo thành công! 🚀**
