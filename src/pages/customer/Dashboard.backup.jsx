import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  LinearProgress,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Alert,
  CircularProgress,
  Paper,
  CardActions,
  Tooltip
} from '@mui/material';
import {
  ElectricCar,
  Schedule,
  Payment,
  Star,
  LocationOn,
  TrendingUp,
  MoreVert,
  Notifications,
  Speed,
  Battery80,
  Timer,
  CheckCircle,
  Warning,
  Cancel,
  Navigation,
  LocalGasStation,
  Eco,
  BatteryChargingFull
} from '@mui/icons-material';
import { useNavigate } from "react-router-dom";
import useAuthStore from '../../store/authStore';
import useStationStore from '../../store/stationStore';
import { mockData } from '../../data/mockData';
import { formatCurrency, formatDate, formatTime, calculateDistance } from '../../utils/helpers';
import { BOOKING_STATUS, STATION_STATUS } from '../../utils/constants';

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { stations, nearbyStations, fetchNearbyStations } = useStationStore();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);

  // Get user's booking data
  const userBookings = mockData.bookings.filter(
    (booking) => booking.userId === user?.id
  );
  const recentBookings = userBookings.slice(0, 4);
  const activeBooking = userBookings.find(
    (booking) => booking.status === 'in_progress'
  );

  // Enhanced stats
  const totalSessions = userBookings.length;
  const totalSpent = userBookings.reduce((sum, booking) => sum + booking.cost, 0);
  const completedSessions = userBookings.filter(
    (booking) => booking.status === 'completed'
  ).length;
  const totalEnergyCharged = userBookings.reduce((sum, booking) => sum + (booking.energyDelivered || 0), 0);
  const avgSessionDuration = userBookings.length > 0 
    ? Math.round(userBookings.reduce((sum, booking) => sum + booking.duration, 0) / userBookings.length)
    : 0;

  // Environmental impact
  const co2Saved = Math.round(totalEnergyCharged * 0.5); // Rough calculation: 0.5kg CO2 saved per kWh

  const quickActions = [
    {
      title: "Find Charging Stations",
      description: "Locate nearby available charging points",
      icon: <LocationOn color="primary" />,
      action: () => navigate("/customer/find-stations"),
    },
    {
      title: "View History",
      description: "Check your past charging sessions",
      icon: <History color="success" />,
      action: () => navigate("/customer/history"),
    },
    {
      title: "Payment Methods",
      description: "Manage your payment options",
      icon: <Payment color="warning" />,
      action: () => navigate("/customer/payment"),
    },
  ];

  return (
    <Box>
      {/* Welcome Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Welcome back, {user?.profile?.firstName}! 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your EV charging sessions and discover new stations
        </Typography>
      </Box>

      {/* Active Charging Session */}
      {activeBooking && (
        <Card sx={{ mb: 4, border: 2, borderColor: "success.main" }}>
          <CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6" fontWeight="bold" color="success.main">
                🔋 Active Charging Session
              </Typography>
              <Chip label="In Progress" color="success" />
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Station
                </Typography>
                <Typography variant="h6" gutterBottom>
                  {
                    mockStations.find((s) => s.id === activeBooking.stationId)
                      ?.name
                  }
                </Typography>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Energy Delivered
                </Typography>
                <Typography variant="h5" fontWeight="bold" color="success.main">
                  {activeBooking.currentEnergyDelivered} kWh
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Estimated Cost
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  ₫{activeBooking.estimatedCost?.toLocaleString()}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  gutterBottom
                  sx={{ mt: 2 }}
                >
                  Progress
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={65}
                  sx={{ height: 8, borderRadius: 4 }}
                />
                <Typography variant="caption" color="text.secondary">
                  Estimated completion:{" "}
                  {new Date(
                    activeBooking.estimatedEndTime
                  ).toLocaleTimeString()}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <ElectricCar
                sx={{ fontSize: 40, color: "primary.main", mb: 1 }}
              />
              <Typography variant="h4" fontWeight="bold" color="primary.main">
                {totalSessions}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Sessions
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <TrendingUp sx={{ fontSize: 40, color: "success.main", mb: 1 }} />
              <Typography variant="h4" fontWeight="bold" color="success.main">
                {totalEnergy.toFixed(1)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                kWh Charged
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <Payment sx={{ fontSize: 40, color: "warning.main", mb: 1 }} />
              <Typography variant="h4" fontWeight="bold" color="warning.main">
                ₫{totalSpent.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Spent
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Quick Actions
              </Typography>

              <List>
                {quickActions.map((action, index) => (
                  <ListItem
                    key={index}
                    button
                    onClick={action.action}
                    sx={{
                      borderRadius: 2,
                      mb: 1,
                      "&:hover": {
                        backgroundColor: "grey.100",
                      },
                    }}
                  >
                    <ListItemIcon>{action.icon}</ListItemIcon>
                    <ListItemText
                      primary={action.title}
                      secondary={action.description}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6" fontWeight="bold">
                  Recent Sessions
                </Typography>
                <Button
                  size="small"
                  onClick={() => navigate("/customer/history")}
                >
                  View All
                </Button>
              </Box>

              {recentBookings.length > 0 ? (
                <List>
                  {recentBookings.map((booking) => {
                    const station = mockStations.find(
                      (s) => s.id === booking.stationId
                    );
                    return (
                      <ListItem key={booking.id} sx={{ px: 0 }}>
                        <ListItemIcon>
                          <Schedule color="action" />
                        </ListItemIcon>
                        <ListItemText
                          primary={station?.name}
                          secondary={
                            <>
                              {new Date(booking.endTime).toLocaleDateString()} •
                              {booking.energyDelivered}kWh • ₫
                              {booking.cost.total.toLocaleString()}
                            </>
                          }
                        />
                      </ListItem>
                    );
                  })}
                </List>
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textAlign: "center", py: 3 }}
                >
                  No recent sessions found
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Bookings */}
        {upcomingBookings.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Upcoming Bookings
                </Typography>

                <List>
                  {upcomingBookings.map((booking) => {
                    const station = mockStations.find(
                      (s) => s.id === booking.stationId
                    );
                    return (
                      <ListItem key={booking.id}>
                        <ListItemIcon>
                          <Schedule color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={station?.name}
                          secondary={`Scheduled: ${new Date(
                            booking.scheduledTime
                          ).toLocaleString()} • 
                            Est. Cost: ₫${booking.estimatedCost?.toLocaleString()}`}
                        />
                        <Chip label="Scheduled" color="primary" size="small" />
                      </ListItem>
                    );
                  })}
                </List>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default CustomerDashboard;
