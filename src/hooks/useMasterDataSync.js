import React from 'react';
import useBookingStore from '../store/bookingStore';
import useAuthStore from '../store/authStore';

/**
 * Master Data Sync - Đảm bảo tất cả components sử dụng cùng data
 * Sử dụng function này trong tất cả các components cần data
 */
export const useMasterDataSync = () => {
    const { user } = useAuthStore();
    const {
        bookingHistory,
        getBookingStats,
        initializeMockData
    } = useBookingStore();

    // Ensure data is initialized once
    React.useEffect(() => {
        if (user && bookingHistory.length === 0) {
            console.log('🔄 Master Data Sync - Initializing data...');
            initializeMockData();
        }
    }, [user, bookingHistory.length, initializeMockData]);

    // Return unified stats
    const stats = getBookingStats();

    // Add debugging info
    React.useEffect(() => {
        if (bookingHistory.length > 0) {
            console.log('📊 Master Data Sync - Current stats:', {
                total: stats.total,
                completed: stats.completed,
                totalAmount: stats.totalAmount,
                totalEnergyCharged: stats.totalEnergyCharged,
                bookingHistoryLength: bookingHistory.length
            });
        }
    }, [stats, bookingHistory.length]);

    return {
        bookingHistory,
        stats,
        completedBookings: bookingHistory.filter(b => b.status === 'completed'),
        isDataReady: bookingHistory.length > 0
    };
};