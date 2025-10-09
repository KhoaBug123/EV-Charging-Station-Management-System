/**
 * SkaEV API Service
 * Kết nối với ASP.NET Core Web API Backend
 */

import axios from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      // Server responded with error
      const message = error.response.data?.message || 'Đã xảy ra lỗi';
      console.error('API Error:', message);
      
      // Handle 401 Unauthorized
      if (error.response.status === 401) {
        localStorage.removeItem('authToken');
        window.location.href = '/login';
      }
      
      throw new Error(message);
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.message);
      throw new Error('Không thể kết nối đến server');
    } else {
      console.error('Error:', error.message);
      throw error;
    }
  }
);

// ============== STATIONS API ==============

export const stationService = {
  /**
   * Get all stations with filtering
   * @param {Object} params - Filter parameters
   */
  getAll: (params = {}) => {
    return apiClient.get('/stations', { params });
  },

  /**
   * Get station by ID
   * @param {string} id - Station ID
   */
  getById: (id) => {
    return apiClient.get(`/stations/${id}`);
  },

  /**
   * Get nearby stations
   * @param {number} latitude
   * @param {number} longitude
   * @param {number} radiusKm
   */
  getNearby: (latitude, longitude, radiusKm = 10) => {
    return apiClient.get('/stations/nearby', {
      params: { latitude, longitude, radiusKm, limit: 20 }
    });
  },

  /**
   * Get available charging posts
   * @param {string} stationId
   * @param {string} connectorType
   */
  getAvailablePosts: (stationId, connectorType = null) => {
    return apiClient.get(`/stations/${stationId}/available-posts`, {
      params: { connectorType }
    });
  },

  /**
   * Get station statistics
   * @param {string} stationId
   */
  getStatistics: (stationId) => {
    return apiClient.get(`/stations/${stationId}/statistics`);
  },

  /**
   * Get all cities with stations
   */
  getCities: () => {
    return apiClient.get('/stations/cities');
  },

  /**
   * Get station reviews
   * @param {string} stationId
   * @param {number} pageNumber
   * @param {number} pageSize
   */
  getReviews: (stationId, pageNumber = 1, pageSize = 10) => {
    return apiClient.get(`/stations/${stationId}/reviews`, {
      params: { pageNumber, pageSize }
    });
  },

  /**
   * Create station (Admin only)
   * @param {Object} stationData
   */
  create: (stationData) => {
    return apiClient.post('/stations', stationData);
  },

  /**
   * Update station (Admin only)
   * @param {string} id
   * @param {Object} stationData
   */
  update: (id, stationData) => {
    return apiClient.put(`/stations/${id}`, stationData);
  },

  /**
   * Delete station (Admin only)
   * @param {string} id
   */
  delete: (id) => {
    return apiClient.delete(`/stations/${id}`);
  }
};

// ============== BOOKINGS API ==============

export const bookingService = {
  /**
   * Create new booking
   * @param {Object} bookingData
   */
  create: (bookingData) => {
    return apiClient.post('/bookings', bookingData);
  },

  /**
   * Get booking by ID
   * @param {string} id
   */
  getById: (id) => {
    return apiClient.get(`/bookings/${id}`);
  },

  /**
   * Get user bookings
   * @param {string} userId
   * @param {Object} params
   */
  getUserBookings: (userId, params = {}) => {
    return apiClient.get(`/bookings/user/${userId}`, { params });
  },

  /**
   * Get current active booking
   * @param {string} userId
   */
  getCurrentBooking: (userId) => {
    return apiClient.get(`/bookings/user/${userId}/current`);
  },

  /**
   * Check availability
   * @param {Object} checkData
   */
  checkAvailability: (checkData) => {
    return apiClient.post('/bookings/check-availability', checkData);
  },

  /**
   * Cancel booking
   * @param {string} id
   * @param {string} reason
   */
  cancel: (id, reason) => {
    return apiClient.post(`/bookings/${id}/cancel`, { reason });
  },

  /**
   * Update booking status
   * @param {string} id
   * @param {string} status
   */
  updateStatus: (id, status) => {
    return apiClient.put(`/bookings/${id}/status`, { status });
  },

  /**
   * Get booking history
   * @param {string} userId
   * @param {Object} params
   */
  getHistory: (userId, params = {}) => {
    return apiClient.get(`/bookings/user/${userId}/history`, { params });
  },

  /**
   * Get upcoming bookings
   * @param {string} userId
   */
  getUpcoming: (userId) => {
    return apiClient.get(`/bookings/user/${userId}/upcoming`);
  },

  /**
   * Reschedule booking
   * @param {string} id
   * @param {string} newScheduledDateTime
   */
  reschedule: (id, newScheduledDateTime) => {
    return apiClient.put(`/bookings/${id}/reschedule`, { newScheduledDateTime });
  }
};

// ============== CHARGING SESSIONS API ==============

export const chargingService = {
  /**
   * Scan QR code
   * @param {Object} scanData
   */
  scanQR: (scanData) => {
    return apiClient.post('/chargingsessions/scan-qr', scanData);
  },

  /**
   * Start charging session
   * @param {Object} startData
   */
  startSession: (startData) => {
    return apiClient.post('/chargingsessions/start', startData);
  },

  /**
   * Get session by ID
   * @param {string} sessionId
   */
  getSession: (sessionId) => {
    return apiClient.get(`/chargingsessions/${sessionId}`);
  },

  /**
   * Get realtime charging data
   * @param {string} sessionId
   */
  getRealtimeData: (sessionId) => {
    return apiClient.get(`/chargingsessions/${sessionId}/realtime`);
  },

  /**
   * Stop charging session
   * @param {string} sessionId
   * @param {string} notes
   */
  stopSession: (sessionId, notes = '') => {
    return apiClient.post(`/chargingsessions/${sessionId}/stop`, { notes });
  },

  /**
   * Get active session
   * @param {string} userId
   */
  getActiveSession: (userId) => {
    return apiClient.get(`/chargingsessions/user/${userId}/active`);
  },

  /**
   * Get session history
   * @param {string} userId
   * @param {Object} params
   */
  getHistory: (userId, params = {}) => {
    return apiClient.get(`/chargingsessions/user/${userId}/history`, { params });
  },

  /**
   * Get user statistics
   * @param {string} userId
   * @param {Object} params
   */
  getStatistics: (userId, params = {}) => {
    return apiClient.get(`/chargingsessions/user/${userId}/statistics`, { params });
  },

  /**
   * Emergency stop
   * @param {string} sessionId
   */
  emergencyStop: (sessionId) => {
    return apiClient.post(`/chargingsessions/${sessionId}/emergency-stop`);
  },

  /**
   * Update session notes
   * @param {string} sessionId
   * @param {string} notes
   */
  updateNotes: (sessionId, notes) => {
    return apiClient.put(`/chargingsessions/${sessionId}/notes`, { notes });
  }
};

// ============== PAYMENTS API ==============

export const paymentService = {
  /**
   * Create payment
   * @param {Object} paymentData
   */
  create: (paymentData) => {
    return apiClient.post('/payments', paymentData);
  },

  /**
   * Get payment by ID
   * @param {string} paymentId
   */
  getById: (paymentId) => {
    return apiClient.get(`/payments/${paymentId}`);
  },

  /**
   * Process payment
   * @param {string} paymentId
   * @param {Object} processData
   */
  process: (paymentId, processData) => {
    return apiClient.post(`/payments/${paymentId}/process`, processData);
  },

  /**
   * Get payment methods
   * @param {string} userId
   */
  getPaymentMethods: (userId) => {
    return apiClient.get(`/payments/user/${userId}/methods`);
  },

  /**
   * Add payment method
   * @param {string} userId
   * @param {Object} methodData
   */
  addPaymentMethod: (userId, methodData) => {
    return apiClient.post(`/payments/user/${userId}/methods`, methodData);
  },

  /**
   * Get wallet balance
   * @param {string} userId
   */
  getWallet: (userId) => {
    return apiClient.get(`/payments/user/${userId}/wallet`);
  },

  /**
   * Top up wallet
   * @param {string} userId
   * @param {Object} topupData
   */
  topUpWallet: (userId, topupData) => {
    return apiClient.post(`/payments/user/${userId}/wallet/topup`, topupData);
  },

  /**
   * Get payment history
   * @param {string} userId
   * @param {Object} params
   */
  getHistory: (userId, params = {}) => {
    return apiClient.get(`/payments/user/${userId}/history`, { params });
  },

  /**
   * Request refund
   * @param {string} paymentId
   * @param {Object} refundData
   */
  requestRefund: (paymentId, refundData) => {
    return apiClient.post(`/payments/${paymentId}/refund`, refundData);
  },

  /**
   * Get invoice
   * @param {string} paymentId
   */
  getInvoice: (paymentId) => {
    return apiClient.get(`/payments/${paymentId}/invoice`);
  },

  /**
   * Download invoice PDF
   * @param {string} paymentId
   */
  downloadInvoice: (paymentId) => {
    window.open(`${API_BASE_URL}/payments/${paymentId}/invoice/download`, '_blank');
  }
};

// ============== REVIEWS API ==============

export const reviewService = {
  /**
   * Create review
   * @param {Object} reviewData
   */
  create: (reviewData) => {
    return apiClient.post('/reviews', reviewData);
  },

  /**
   * Get review by ID
   * @param {string} reviewId
   */
  getById: (reviewId) => {
    return apiClient.get(`/reviews/${reviewId}`);
  },

  /**
   * Update review
   * @param {string} reviewId
   * @param {Object} reviewData
   */
  update: (reviewId, reviewData) => {
    return apiClient.put(`/reviews/${reviewId}`, reviewData);
  },

  /**
   * Delete review
   * @param {string} reviewId
   */
  delete: (reviewId) => {
    return apiClient.delete(`/reviews/${reviewId}`);
  },

  /**
   * Get user reviews
   * @param {string} userId
   * @param {Object} params
   */
  getUserReviews: (userId, params = {}) => {
    return apiClient.get(`/reviews/user/${userId}`, { params });
  },

  /**
   * Get station reviews
   * @param {string} stationId
   * @param {Object} params
   */
  getStationReviews: (stationId, params = {}) => {
    return apiClient.get(`/reviews/station/${stationId}`, { params });
  },

  /**
   * Like review
   * @param {string} reviewId
   * @param {string} userId
   */
  like: (reviewId, userId) => {
    return apiClient.post(`/reviews/${reviewId}/like`, { userId });
  },

  /**
   * Report review
   * @param {string} reviewId
   * @param {Object} reportData
   */
  report: (reviewId, reportData) => {
    return apiClient.post(`/reviews/${reviewId}/report`, reportData);
  }
};

// ============== NOTIFICATIONS API ==============

export const notificationService = {
  /**
   * Get user notifications
   * @param {string} userId
   * @param {Object} params
   */
  getUserNotifications: (userId, params = {}) => {
    return apiClient.get(`/notifications/user/${userId}`, { params });
  },

  /**
   * Get notification by ID
   * @param {string} notificationId
   */
  getById: (notificationId) => {
    return apiClient.get(`/notifications/${notificationId}`);
  },

  /**
   * Mark as read
   * @param {string} notificationId
   */
  markAsRead: (notificationId) => {
    return apiClient.put(`/notifications/${notificationId}/read`);
  },

  /**
   * Mark all as read
   * @param {string} userId
   */
  markAllAsRead: (userId) => {
    return apiClient.put(`/notifications/user/${userId}/read-all`);
  },

  /**
   * Delete notification
   * @param {string} notificationId
   */
  delete: (notificationId) => {
    return apiClient.delete(`/notifications/${notificationId}`);
  },

  /**
   * Get notification settings
   * @param {string} userId
   */
  getSettings: (userId) => {
    return apiClient.get(`/notifications/user/${userId}/settings`);
  },

  /**
   * Update notification settings
   * @param {string} userId
   * @param {Object} settingsData
   */
  updateSettings: (userId, settingsData) => {
    return apiClient.put(`/notifications/user/${userId}/settings`, settingsData);
  },

  /**
   * Get unread count
   * @param {string} userId
   */
  getUnreadCount: (userId) => {
    return apiClient.get(`/notifications/user/${userId}/unread-count`);
  },

  /**
   * Send notification (Admin)
   * @param {Object} notificationData
   */
  send: (notificationData) => {
    return apiClient.post('/notifications/send', notificationData);
  }
};

// Export default axios instance for custom requests
export default apiClient;
