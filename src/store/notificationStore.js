import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

// Notification store for real-time updates
const useNotificationStore = create(
  subscribeWithSelector((set, get) => ({
    // State
    notifications: [],
    unreadCount: 0,
    settings: {
      browser: true,
      email: true,
      sms: false,
      sound: true,
      charging: true,
      booking: true,
      payment: true,
      maintenance: false,
    },
    isConnected: false,
    lastUpdate: null,

    // Actions
    addNotification: (notification) => {
      const newNotification = {
        id: Date.now() + Math.random(),
        timestamp: new Date().toISOString(),
        read: false,
        ...notification,
      };

      set((state) => ({
        notifications: [newNotification, ...state.notifications].slice(0, 50), // Keep only last 50
        unreadCount: state.unreadCount + 1,
        lastUpdate: new Date().toISOString(),
      }));

      // Trigger browser notification if enabled
      const { settings } = get();
      if (settings.browser && settings[notification.category]) {
        get().showBrowserNotification(newNotification);
      }

      // Play sound if enabled
      if (settings.sound) {
        get().playNotificationSound(notification.type);
      }
    },

    markAsRead: (notificationId) => {
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    },

    markAllAsRead: () => {
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
        unreadCount: 0,
      }));
    },

    removeNotification: (notificationId) => {
      set((state) => ({
        notifications: state.notifications.filter(
          (n) => n.id !== notificationId
        ),
        unreadCount: state.notifications.find(
          (n) => n.id === notificationId && !n.read
        )
          ? state.unreadCount - 1
          : state.unreadCount,
      }));
    },

    clearAllNotifications: () => {
      set({
        notifications: [],
        unreadCount: 0,
      });
    },

    updateSettings: (newSettings) => {
      set((state) => ({
        settings: { ...state.settings, ...newSettings },
      }));

      // Save to localStorage
      localStorage.setItem(
        "skaev_notification_settings",
        JSON.stringify(get().settings)
      );
    },

    loadSettings: () => {
      try {
        const saved = localStorage.getItem("skaev_notification_settings");
        if (saved) {
          const settings = JSON.parse(saved);
          set((state) => ({
            settings: { ...state.settings, ...settings },
          }));
        }
      } catch (error) {
        console.error("Failed to load notification settings:", error);
      }
    },

    // Real-time connection
    connect: () => {
      if (get().isConnected) return;

      // Simulate WebSocket connection
      console.log("🔌 Connecting to notification service...");

      // Mock connection after delay
      setTimeout(() => {
        set({ isConnected: true });
        console.log("✅ Connected to notification service");

        // Start receiving mock real-time updates
        get().startMockUpdates();
      }, 1000);
    },

    disconnect: () => {
      set({ isConnected: false });
      console.log("🔌 Disconnected from notification service");
    },

    // Mock real-time updates
    startMockUpdates: () => {
      const mockNotifications = [
        {
          type: "success",
          category: "charging",
          title: "Charging Complete",
          message: "Your vehicle at Tech Park SuperCharger is fully charged!",
          priority: "high",
          actions: [
            { label: "View Details", action: "view_session" },
            { label: "Disconnect", action: "end_session" },
          ],
        },
        {
          type: "info",
          category: "booking",
          title: "Booking Reminder",
          message:
            "Your charging session starts in 15 minutes at Green Mall Hub",
          priority: "medium",
          actions: [
            { label: "Get Directions", action: "navigate" },
            { label: "Modify", action: "edit_booking" },
          ],
        },
        {
          type: "warning",
          category: "maintenance",
          title: "Station Maintenance",
          message:
            "EcoPark Station will be offline for maintenance from 2:00 AM - 6:00 AM",
          priority: "low",
        },
        {
          type: "success",
          category: "payment",
          title: "Payment Successful",
          message: "Payment of ₫125,000 processed successfully",
          priority: "medium",
        },
      ];

      // Send random notifications every 10-30 seconds
      const sendMockNotification = () => {
        if (!get().isConnected) return;

        const randomNotification =
          mockNotifications[
            Math.floor(Math.random() * mockNotifications.length)
          ];

        get().addNotification(randomNotification);

        // Schedule next notification
        setTimeout(sendMockNotification, Math.random() * 20000 + 10000); // 10-30 seconds
      };

      // Start after 5 seconds
      setTimeout(sendMockNotification, 5000);
    },

    // Browser notifications
    requestPermission: async () => {
      if (!("Notification" in window)) {
        console.warn("Browser does not support notifications");
        return false;
      }

      if (Notification.permission === "granted") {
        return true;
      }

      if (Notification.permission === "denied") {
        console.warn("Notification permission denied");
        return false;
      }

      const permission = await Notification.requestPermission();
      return permission === "granted";
    },

    showBrowserNotification: async (notification) => {
      if (!("Notification" in window)) return;

      const hasPermission = await get().requestPermission();
      if (!hasPermission) return;

      const browserNotification = new Notification(notification.title, {
        body: notification.message,
        icon: "/vite.svg", // SkaEV icon
        badge: "/vite.svg",
        tag: notification.category,
        requireInteraction: notification.priority === "high",
        data: notification,
      });

      browserNotification.onclick = () => {
        window.focus();
        browserNotification.close();

        // Handle notification click action
        if (notification.actions && notification.actions[0]) {
          console.log("Notification clicked:", notification.actions[0].action);
        }
      };

      // Auto close after 5 seconds for non-high priority
      if (notification.priority !== "high") {
        setTimeout(() => browserNotification.close(), 5000);
      }
    },

    // Sound notifications
    playNotificationSound: (type) => {
      // Create audio context for notification sounds
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();

      const playTone = (frequency, duration, volume = 0.3) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(
          frequency,
          audioContext.currentTime
        );
        gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + duration
        );

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
      };

      // Different sounds for different notification types
      switch (type) {
        case "success":
          playTone(800, 0.2);
          setTimeout(() => playTone(1000, 0.2), 100);
          break;
        case "warning":
          playTone(400, 0.3);
          setTimeout(() => playTone(400, 0.3), 200);
          break;
        case "error":
          playTone(300, 0.5);
          break;
        default:
          playTone(600, 0.2);
      }
    },

    // Utility functions
    getUnreadNotifications: () => {
      return get().notifications.filter((n) => !n.read);
    },

    getNotificationsByCategory: (category) => {
      return get().notifications.filter((n) => n.category === category);
    },

    getRecentNotifications: (hours = 24) => {
      const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
      return get().notifications.filter((n) => new Date(n.timestamp) > cutoff);
    },

    // Predefined notification templates
    sendChargingCompleteNotification: (stationName, sessionData) => {
      get().addNotification({
        type: "success",
        category: "charging",
        title: "Charging Complete! ⚡",
        message: `Your vehicle at ${stationName} is fully charged. Energy delivered: ${sessionData.energy}kWh`,
        priority: "high",
        data: sessionData,
        actions: [
          { label: "View Receipt", action: "view_receipt" },
          { label: "End Session", action: "end_session" },
        ],
      });
    },

    sendBookingReminderNotification: (stationName, timeToSession) => {
      get().addNotification({
        type: "info",
        category: "booking",
        title: "Booking Reminder 📅",
        message: `Your charging session at ${stationName} starts in ${timeToSession} minutes`,
        priority: "medium",
        actions: [
          { label: "Get Directions", action: "navigate" },
          { label: "Modify Booking", action: "edit_booking" },
        ],
      });
    },

    sendPaymentNotification: (amount, status) => {
      get().addNotification({
        type: status === "success" ? "success" : "error",
        category: "payment",
        title:
          status === "success" ? "Payment Successful 💳" : "Payment Failed ❌",
        message: `Payment of ${amount} ${
          status === "success"
            ? "processed successfully"
            : "could not be processed"
        }`,
        priority: "medium",
      });
    },

    sendMaintenanceNotification: (stationName, maintenanceWindow) => {
      get().addNotification({
        type: "warning",
        category: "maintenance",
        title: "Maintenance Notice 🔧",
        message: `${stationName} will be offline for maintenance ${maintenanceWindow}`,
        priority: "low",
      });
    },
  }))
);

export default useNotificationStore;
