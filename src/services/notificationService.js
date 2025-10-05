/**
 * Notification Service - Push Notifications & In-App Notifications
 * Provides both Web Push API notifications and in-app notification center
 */

class NotificationService {
    constructor() {
        this.notifications = [];
        this.listeners = new Set();
        this.unreadCount = 0;

        // Daily promotion management (max 2 per day)
        this.dailyPromotions = this.loadDailyPromotions();
    }

    // Load/save daily promotions from localStorage
    loadDailyPromotions() {
        try {
            const stored = localStorage.getItem('skaev_daily_promotions');
            if (stored) {
                const data = JSON.parse(stored);
                const today = new Date().toDateString();

                // Reset if it's a new day
                if (data.date !== today) {
                    return { date: today, count: 0 };
                }
                return data;
            }
        } catch (error) {
            console.error('Error loading daily promotions:', error);
        }
        return { date: new Date().toDateString(), count: 0 };
    }

    saveDailyPromotions() {
        try {
            localStorage.setItem('skaev_daily_promotions', JSON.stringify(this.dailyPromotions));
        } catch (error) {
            console.error('Error saving daily promotions:', error);
        }
    }

    canShowPromotion() {
        const today = new Date().toDateString();

        // Reset if new day
        if (this.dailyPromotions.date !== today) {
            this.dailyPromotions = { date: today, count: 0 };
            this.saveDailyPromotions();
        }

        // Check limit (max 2 per day)
        return this.dailyPromotions.count < 2;
    }

    incrementPromotionCount() {
        this.dailyPromotions.count++;
        this.saveDailyPromotions();
    }

    // Initialize Web Push Notifications
    async requestPermission() {
        if (!('Notification' in window)) {
            console.warn('This browser does not support notifications');
            return false;
        }

        if (Notification.permission === 'granted') {
            return true;
        }

        if (Notification.permission !== 'denied') {
            const permission = await Notification.requestPermission();
            return permission === 'granted';
        }

        return false;
    }

    // Show Web Push Notification
    showPushNotification(title, options = {}) {
        if (Notification.permission === 'granted') {
            const notification = new Notification(title, {
                icon: '/vite.svg',
                badge: '/vite.svg',
                ...options
            });

            notification.onclick = () => {
                window.focus();
                if (options.onClick) {
                    options.onClick();
                }
                notification.close();
            };

            return notification;
        }
        return null;
    }

    // Add in-app notification
    addNotification(notification) {
        const newNotification = {
            id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date().toISOString(),
            read: false,
            ...notification
        };

        this.notifications.unshift(newNotification);
        this.unreadCount++;

        // Keep only last 50 notifications
        if (this.notifications.length > 50) {
            this.notifications = this.notifications.slice(0, 50);
        }

        // Notify listeners
        this.notifyListeners();

        // Auto show push notification if permission granted
        if (notification.showPush !== false) {
            this.showPushNotification(notification.title, {
                body: notification.message,
                tag: notification.id,
                onClick: notification.onClick
            });
        }

        return newNotification;
    }

    // Mark notification as read
    markAsRead(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification && !notification.read) {
            notification.read = true;
            this.unreadCount = Math.max(0, this.unreadCount - 1);
            this.notifyListeners();
        }
    }

    // Mark all as read
    markAllAsRead() {
        this.notifications.forEach(n => n.read = true);
        this.unreadCount = 0;
        this.notifyListeners();
    }

    // Get all notifications
    getAll() {
        return [...this.notifications];
    }

    // Get unread notifications
    getUnread() {
        return this.notifications.filter(n => !n.read);
    }

    // Get unread count
    getUnreadCount() {
        return this.unreadCount;
    }

    // Clear all notifications
    clearAll() {
        this.notifications = [];
        this.unreadCount = 0;
        this.notifyListeners();
    }

    // Delete specific notification
    deleteNotification(notificationId) {
        const index = this.notifications.findIndex(n => n.id === notificationId);
        if (index !== -1) {
            const notification = this.notifications[index];
            if (!notification.read) {
                this.unreadCount = Math.max(0, this.unreadCount - 1);
            }
            this.notifications.splice(index, 1);
            this.notifyListeners();
        }
    }

    // Subscribe to notification changes
    subscribe(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    // Notify all listeners
    notifyListeners() {
        this.listeners.forEach(listener => {
            try {
                listener({
                    notifications: this.getAll(),
                    unreadCount: this.unreadCount
                });
            } catch (error) {
                console.error('Error in notification listener:', error);
            }
        });
    }

    // Predefined notification types
    notifyBookingConfirmed(bookingData) {
        return this.addNotification({
            type: 'success',
            category: 'booking',
            title: '✅ Đặt chỗ thành công',
            message: `Đã đặt chỗ tại ${bookingData.stationName}. Mã đặt chỗ: ${bookingData.id}`,
            icon: '📅',
            onClick: () => window.location.href = '/customer/history'
        });
    }

    notifyChargingStarted(sessionData) {
        return this.addNotification({
            type: 'info',
            category: 'charging',
            title: '🔋 Bắt đầu sạc xe',
            message: `Đang sạc tại ${sessionData.stationName}. SOC hiện tại: ${sessionData.currentSOC}%`,
            icon: '⚡',
            onClick: () => window.location.href = '/customer/charging-flow'
        });
    }

    notifyChargingCompleted(sessionData) {
        return this.addNotification({
            type: 'success',
            category: 'charging',
            title: '✅ Hoàn thành sạc xe',
            message: `Đã sạc ${sessionData.energyDelivered || 0} kWh. SOC đạt ${sessionData.finalSOC}%`,
            icon: '🔋',
            onClick: () => window.location.href = '/customer/history'
        });
    }

    notifyPaymentSuccess(paymentData) {
        return this.addNotification({
            type: 'success',
            category: 'payment',
            title: '💳 Thanh toán thành công',
            message: `Đã thanh toán ${paymentData.amount?.toLocaleString()} VNĐ. Mã hóa đơn: ${paymentData.invoiceNumber}`,
            icon: '💰',
            onClick: () => window.location.href = '/customer/payment-history'
        });
    }

    notifyLowBalance(balance) {
        return this.addNotification({
            type: 'warning',
            category: 'wallet',
            title: '⚠️ Số dư ví thấp',
            message: `Số dư ví của bạn còn ${balance?.toLocaleString()} VNĐ. Vui lòng nạp tiền để tiếp tục sử dụng dịch vụ.`,
            icon: '💳',
            onClick: () => window.location.href = '/customer/payment'
        });
    }

    notifySOCTarget(sessionData) {
        return this.addNotification({
            type: 'success',
            category: 'charging',
            title: '🎯 Đạt mục tiêu SOC',
            message: `Pin đã sạc đến ${sessionData.targetSOC}%. Bạn có thể ngắt kết nối.`,
            icon: '🔋',
            showPush: true
        });
    }

    notifyMaintenanceScheduled(maintenanceData) {
        return this.addNotification({
            type: 'warning',
            category: 'maintenance',
            title: '🔧 Bảo trì trạm sạc',
            message: `Trạm ${maintenanceData.stationName} sẽ bảo trì vào ${maintenanceData.scheduledTime}`,
            icon: '⚠️'
        });
    }

    notifyPromotionAvailable(promotionData) {
        // Check daily limit (max 2 promotions per day)
        if (!this.canShowPromotion()) {
            console.log('Daily promotion limit reached (2/day). Skipping notification.');
            return null;
        }

        this.incrementPromotionCount();

        return this.addNotification({
            type: 'info',
            category: 'promotion',
            title: '🎉 Ưu đãi mới',
            message: promotionData.message || 'Có chương trình khuyến mãi mới dành cho bạn!',
            icon: '🎁',
            onClick: () => window.location.href = '/customer/plans'
        });
    }

    // Get today's promotion count (for debugging)
    getTodayPromotionCount() {
        const today = new Date().toDateString();
        if (this.dailyPromotions.date !== today) {
            return 0;
        }
        return this.dailyPromotions.count;
    }

    // Reset promotion count (for testing)
    resetPromotionCount() {
        this.dailyPromotions = { date: new Date().toDateString(), count: 0 };
        this.saveDailyPromotions();
    }
}

// Singleton instance
const notificationService = new NotificationService();

// NOTE: Mock notifications are NOT auto-initialized on startup
// They will only appear when user performs actual actions:
// - Booking confirmed
// - Charging started/completed
// - Payment success
// - etc.

// For demo purposes, use NotificationDemo page to test notifications manually

export default notificationService;
