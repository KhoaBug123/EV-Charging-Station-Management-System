# Google OAuth Setup Guide

## Để sử dụng Google Login thực tế, thực hiện các bước sau:

### 1. Tạo Google Cloud Project
1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project có sẵn
3. Enable Google Identity API

### 2. Cấu hình OAuth 2.0
1. Vào **APIs & Services** > **Credentials**
2. Tạo **OAuth 2.0 Client ID**
3. Chọn **Web application**
4. Thêm **Authorized JavaScript origins**:
   - `http://localhost:5173` (development)
   - `https://yourdomain.com` (production)
5. Thêm **Authorized redirect URIs**:
   - `http://localhost:5173/auth/google/callback`
   - `https://yourdomain.com/auth/google/callback`

### 3. Lấy Client ID
1. Copy **Client ID** từ Google Cloud Console
2. Tạo file `.env` trong root project:
```
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

### 4. Cập nhật socialAuthService.js
Thay thế mock implementation bằng real implementation:

```javascript
import { realGoogleAuthService } from './realGoogleAuth';

// Replace loginWithGoogle method
async loginWithGoogle() {
    return await realGoogleAuthService.loginWithGoogle();
}
```

### 5. Thêm Google Identity Script (Optional)
Thêm vào `index.html` để load trước:
```html
<script src="https://accounts.google.com/gsi/client" async defer></script>
```

## Environment Variables cần thiết:

### Development (.env.development)
```
VITE_GOOGLE_CLIENT_ID=your_dev_client_id
```

### Production (.env.production)  
```
VITE_GOOGLE_CLIENT_ID=your_prod_client_id
```

## Bảo mật quan trọng:

### 1. Domain Verification
- Chỉ thêm domain bạn sở hữu vào Authorized origins
- Không public Client ID trong code

### 2. Server-side Verification
```javascript
// Verify ID token on server
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

async function verify(token) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
  });
  const payload = ticket.getPayload();
  return payload;
}
```

### 3. Token Storage
- Lưu token trong httpOnly cookie
- Implement refresh token rotation
- Set appropriate expiry times

## Testing:

### Development
1. Cấu hình `.env` với Client ID
2. Restart dev server: `npm run dev`
3. Test Google login button

### Production
1. Deploy với production Client ID
2. Verify domain trong Google Console
3. Test trên domain thực tế

## Troubleshooting:

### Lỗi 400 "redirect_uri_mismatch"
- Kiểm tra authorized redirect URIs
- Đảm bảo exact match với domain

### Lỗi "popup_blocked"  
- User cần allow popup
- Implement fallback redirect flow

### Lỗi "invalid_client"
- Kiểm tra Client ID đúng
- Verify environment variable

### CORS errors
- Thêm domain vào authorized origins
- Kiểm tra HTTPS in production