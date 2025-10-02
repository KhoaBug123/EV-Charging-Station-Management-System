// Social authentication service
import { generateId } from "../utils/helpers";

class SocialAuthService {
    constructor() {
        this.providers = {
            google: {
                clientId: import.meta.env?.VITE_GOOGLE_CLIENT_ID || "mock-google-client-id",
                redirectUri: `${window.location.origin}/auth/google/callback`,
                scope: "openid profile email"
            }
        };
    }

    // Google OAuth Login - Mock implementation for demo
    async loginWithGoogle() {
        try {
            // Show confirmation dialog instead of opening real OAuth
            const confirmed = window.confirm(
                "Demo Google Login\n\n" +
                "Trong ứng dụng thực tế, đây sẽ mở Google OAuth.\n" +
                "Bấm OK để mô phỏng đăng nhập thành công với tài khoản Google demo."
            );

            if (!confirmed) {
                throw new Error("User cancelled Google login");
            }

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Return mock successful login
            return {
                provider: "google",
                user: {
                    id: generateId("google-"),
                    email: "demo.user@gmail.com",
                    name: "Demo Google User",
                    avatar: "https://lh3.googleusercontent.com/a/default-user=s96-c",
                    verified: true
                },
                accessToken: `google-demo-token-${Date.now()}`
            };
        } catch (error) {
            throw new Error(`Google login failed: ${error.message}`);
        }
    }



    // Phone number verification (Vietnamese carriers)
    async loginWithPhone(phoneNumber) {
        try {
            // Validate Vietnamese phone number format
            const phoneRegex = /^(\+84|0)(3|5|7|8|9)[0-9]{8}$/;
            if (!phoneRegex.test(phoneNumber)) {
                throw new Error("Số điện thoại không hợp lệ");
            }

            // Simulate sending OTP
            await new Promise(resolve => setTimeout(resolve, 1000));

            const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

            // In real app, send SMS via provider (Twilio, AWS SNS, etc.)
            console.log(`SMS OTP Code for ${phoneNumber}: ${otpCode}`);

            return {
                success: true,
                otpCode, // Remove in production
                message: `Mã OTP đã được gửi đến ${phoneNumber}`,
                expiresIn: 300 // 5 minutes
            };
        } catch (error) {
            throw new Error(`Phone verification failed: ${error.message}`);
        }
    }

    async verifyPhoneOTP(phoneNumber, otpCode) {
        try {
            // Mock OTP verification
            await new Promise(resolve => setTimeout(resolve, 500));

            if (otpCode === "123456") {
                return {
                    provider: "phone",
                    user: {
                        id: generateId("phone-"),
                        phone: phoneNumber,
                        name: "Phone User",
                        avatar: "https://via.placeholder.com/150/28a745/white?text=📱",
                        verified: true
                    },
                    accessToken: `phone-token-${Date.now()}`
                };
            } else {
                throw new Error("Mã OTP không chính xác");
            }
        } catch (error) {
            throw new Error(`OTP verification failed: ${error.message}`);
        }
    }

    // Build auth URLs
    buildGoogleAuthUrl() {
        const params = new URLSearchParams({
            client_id: this.providers.google.clientId,
            redirect_uri: this.providers.google.redirectUri,
            scope: this.providers.google.scope,
            response_type: "code",
            access_type: "offline",
            prompt: "consent"
        });
        return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
    }



    // Link social account to existing account
    async linkSocialAccount(userId, provider, socialData) {
        try {
            // Mock linking process
            await new Promise(resolve => setTimeout(resolve, 800));

            return {
                success: true,
                linkedAccount: {
                    provider,
                    socialId: socialData.user.id,
                    email: socialData.user.email,
                    name: socialData.user.name,
                    linkedAt: new Date().toISOString()
                }
            };
        } catch (error) {
            throw new Error(`Account linking failed: ${error.message}`);
        }
    }

    // Unlink social account
    async unlinkSocialAccount(userId, provider) {
        try {
            await new Promise(resolve => setTimeout(resolve, 500));

            return {
                success: true,
                message: `${provider} account unlinked successfully`
            };
        } catch (error) {
            throw new Error(`Account unlinking failed: ${error.message}`);
        }
    }

    // Get linked accounts for user
    async getLinkedAccounts() {
        try {
            // Mock linked accounts data
            await new Promise(resolve => setTimeout(resolve, 300));

            return {
                success: true,
                linkedAccounts: [
                    {
                        provider: "google",
                        email: "user@gmail.com",
                        name: "Google Account",
                        linkedAt: "2024-03-01T08:00:00Z",
                        status: "active"
                    }
                ]
            };
        } catch (error) {
            throw new Error(`Failed to get linked accounts: ${error.message}`);
        }
    }
}

// Create singleton instance
export const socialAuthService = new SocialAuthService();

// Convenience methods
export const loginWithGoogle = () => socialAuthService.loginWithGoogle();
export const loginWithPhone = (phone) => socialAuthService.loginWithPhone(phone);
export const verifyPhoneOTP = (phone, otp) => socialAuthService.verifyPhoneOTP(phone, otp);

// Google Auth object for login/register consistency
export const googleAuth = {
    signIn: async () => {
        try {
            const result = await socialAuthService.loginWithGoogle();
            return {
                success: true,
                user: result.user,
                accessToken: result.accessToken
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    },

    signUp: async () => {
        try {
            // Show confirmation for registration
            const confirmed = window.confirm(
                "Demo Google Registration\n\n" +
                "Trong ứng dụng thực tế, đây sẽ mở Google OAuth cho đăng ký.\n" +
                "Bấm OK để mô phỏng đăng ký thành công với tài khoản Google demo."
            );

            if (!confirmed) {
                throw new Error("User cancelled Google registration");
            }

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Return mock successful registration
            return {
                success: true,
                user: {
                    id: generateId("google-"),
                    email: "new.user@gmail.com",
                    name: "New Google User",
                    firstName: "New Google",
                    lastName: "User",
                    avatar: "https://lh3.googleusercontent.com/a/default-user=s96-c",
                    verified: true
                },
                accessToken: `google-demo-token-${Date.now()}`
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
};

// Phone OTP service object
export const phoneOTPService = {
    sendOTP: (phone) => socialAuthService.loginWithPhone(phone),
    verifyOTP: (phone, otp) => socialAuthService.verifyPhoneOTP(phone, otp)
};

export default socialAuthService;