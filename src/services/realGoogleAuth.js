/**
 * Real Google OAuth Implementation using Google Identity Services
 * This is the production-ready implementation that should be used in real apps
 */

class RealGoogleAuthService {
    constructor() {
        this.clientId = import.meta.env?.VITE_GOOGLE_CLIENT_ID;
        this.isGoogleLoaded = false;
        this.initPromise = null;
    }

    // Initialize Google Identity Services
    async initialize() {
        if (this.initPromise) {
            return this.initPromise;
        }

        this.initPromise = new Promise((resolve, reject) => {
            // Check if Google Identity Services is already loaded
            if (window.google?.accounts) {
                this.isGoogleLoaded = true;
                resolve();
                return;
            }

            // Load Google Identity Services script
            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            script.defer = true;

            script.onload = () => {
                // Wait for google object to be available
                const checkGoogle = setInterval(() => {
                    if (window.google?.accounts) {
                        clearInterval(checkGoogle);
                        this.isGoogleLoaded = true;
                        resolve();
                    }
                }, 100);

                // Timeout after 10 seconds
                setTimeout(() => {
                    clearInterval(checkGoogle);
                    reject(new Error('Google Identity Services failed to load'));
                }, 10000);
            };

            script.onerror = () => {
                reject(new Error('Failed to load Google Identity Services'));
            };

            document.head.appendChild(script);
        });

        return this.initPromise;
    }

    // Real Google OAuth login
    async loginWithGoogle() {
        try {
            if (!this.clientId) {
                throw new Error('Google Client ID not configured. Please set VITE_GOOGLE_CLIENT_ID in environment variables.');
            }

            // Initialize Google services
            await this.initialize();

            return new Promise((resolve, reject) => {
                // Initialize Google Sign-In
                window.google.accounts.id.initialize({
                    client_id: this.clientId,
                    callback: (response) => {
                        this.handleGoogleResponse(response)
                            .then(resolve)
                            .catch(reject);
                    },
                    auto_select: false,
                    cancel_on_tap_outside: true
                });

                // Create and show the One Tap prompt
                window.google.accounts.id.prompt((notification) => {
                    if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                        // Fallback to popup if One Tap is not available
                        this.showGooglePopup().then(resolve).catch(reject);
                    }
                });
            });
        } catch (error) {
            throw new Error(`Google login failed: ${error.message}`);
        }
    }

    // Fallback popup method
    async showGooglePopup() {
        return new Promise((resolve, reject) => {
            window.google.accounts.oauth2.initTokenClient({
                client_id: this.clientId,
                scope: 'email profile openid',
                callback: async (response) => {
                    if (response.error) {
                        reject(new Error(response.error));
                        return;
                    }

                    try {
                        // Get user info using the access token
                        const userInfo = await this.getUserInfo(response.access_token);
                        resolve({
                            provider: 'google',
                            user: {
                                id: userInfo.id || userInfo.sub,
                                email: userInfo.email,
                                name: userInfo.name,
                                avatar: userInfo.picture,
                                verified: userInfo.email_verified
                            },
                            accessToken: response.access_token
                        });
                    } catch (error) {
                        reject(error);
                    }
                }
            }).requestAccessToken();
        });
    }

    // Handle Google One Tap response
    async handleGoogleResponse(response) {
        try {
            // Decode JWT token
            const userInfo = this.decodeJWT(response.credential);

            return {
                provider: 'google',
                user: {
                    id: userInfo.sub,
                    email: userInfo.email,
                    name: userInfo.name,
                    avatar: userInfo.picture,
                    verified: userInfo.email_verified
                },
                idToken: response.credential
            };
        } catch (error) {
            throw new Error(`Failed to process Google response: ${error.message}`);
        }
    }

    // Get user info from Google API
    async getUserInfo(accessToken) {
        const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to get user info from Google');
        }

        return response.json();
    }

    // Decode JWT token (basic implementation)
    decodeJWT(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );
            return JSON.parse(jsonPayload);
        } catch (_error) {
            throw new Error('Invalid JWT token');
        }
    }

    // Sign out from Google
    async signOut() {
        if (this.isGoogleLoaded && window.google?.accounts) {
            window.google.accounts.id.disableAutoSelect();
        }
    }
}

// Export singleton instance
export const realGoogleAuthService = new RealGoogleAuthService();

export default RealGoogleAuthService;