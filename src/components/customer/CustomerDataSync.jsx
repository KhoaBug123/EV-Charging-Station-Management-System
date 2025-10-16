import React, { useEffect } from 'react';
import useAuthStore from '../../store/authStore';
import useBookingStore from '../../store/bookingStore';
import useVehicleStore from '../../store/vehicleStore';
import useCustomerStore from '../../store/customerStore';

/**
 * CustomerDataSync - Component automatically syncs customer data
 * Wrap this component around customer pages to ensure data synchronization
 */
const CustomerDataSync = ({ children }) => {
    const { user } = useAuthStore();
    const { fetchBookings } = useBookingStore();
    const { fetchVehicles } = useVehicleStore();
    const { initialized, syncAllStores, setInitialized } = useCustomerStore();

    useEffect(() => {
        const initializeCustomerData = async () => {
            // Only initialize if user is logged in and not yet initialized
            if (user && !initialized) {
                console.log('🔄 Initializing customer data sync...');

                try {
                    // Fetch all data from API
                    await Promise.all([
                        fetchBookings(),
                        fetchVehicles(),
                    ]);

                    // Mark as initialized
                    await syncAllStores();
                    setInitialized(true);
                    
                    console.log('✅ Customer data sync completed');
                } catch (error) {
                    console.error('❌ Error syncing customer data:', error);
                }
            }
        };

        initializeCustomerData();
    }, [user, initialized, fetchBookings, fetchVehicles, syncAllStores, setInitialized]);

    // Return children without any UI changes
    return children;
};

export default CustomerDataSync;
