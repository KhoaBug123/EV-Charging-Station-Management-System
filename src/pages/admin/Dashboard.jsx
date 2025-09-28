import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  LinearProgress,
  IconButton,
  Menu,
  MenuItem,
  Alert,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Tooltip,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  ElectricCar,
  People,
  LocationOn,
  TrendingUp,
  Warning,
  CheckCircle,
  Add,
  MoreVert,
  Visibility,
  Edit,
  Delete,
  Analytics,
  PowerSettingsNew,
  MonetizationOn,
  Notifications,
  Settings,
  Download,
  FilterList,
  Search,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import useStationStore from "../../store/stationStore";
import { mockData } from "../../data/mockData";
import {
  formatCurrency,
  formatDate,
  getStatusColor,
} from "../../utils/helpers";
import { STATION_STATUS, USER_ROLES } from "../../utils/constants";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { stations } = useStationStore();
  const [selectedPeriod, setSelectedPeriod] = useState("today");
  const [anchorEl, setAnchorEl] = useState(null);
  const [openStationDialog, setOpenStationDialog] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);

  // System Overview Stats
  const totalStations = stations.length;
  const activeStations = stations.filter((s) => s.status === "active").length;
  const totalUsers = mockData.users.length;
  const totalBookings = mockData.bookings.length;
  const todayBookings = mockData.bookings.filter(
    (b) => new Date(b.date).toDateString() === new Date().toDateString()
  ).length;
  const totalRevenue = mockData.bookings.reduce((sum, b) => sum + b.cost, 0);
  const activeChargingSessions = mockData.bookings.filter(
    (b) => b.status === "in_progress"
  ).length;

  // Station Performance với chargingPosts structure
  const stationPerformance = stations
    .map((station) => {
      const stationBookings = mockData.bookings.filter(
        (b) => b.stationId === station.id
      );
      const revenue = stationBookings.reduce((sum, b) => sum + b.cost, 0);
      
      // Tính utilization từ chargingPosts
      let totalSlots = 0;
      let occupiedSlots = 0;
      
      if (station.charging?.chargingPosts) {
        station.charging.chargingPosts.forEach(post => {
          totalSlots += post.totalSlots;
          occupiedSlots += (post.totalSlots - post.availableSlots);
        });
      }
      
      const utilization = totalSlots > 0 ? (occupiedSlots / totalSlots) * 100 : 0;

      return {
        ...station,
        bookingsCount: stationBookings.length,
        revenue,
        utilization,
        totalSlots,
        occupiedSlots,
        chargingPostsCount: station.charging?.chargingPosts?.length || 0,
      };
    })
    .sort((a, b) => b.revenue - a.revenue);

  // Recent Activities với chargingPosts context
  const recentActivities = [
    {
      id: 1,
      type: "booking",
      message: "New booking at Tech Park SuperCharger - Charging Post A",
      time: "5 minutes ago",
      severity: "info",
    },
    {
      id: 2,
      type: "station",
      message: 'Charging Post B at "Green Mall Hub" went offline',
      time: "15 minutes ago",
      severity: "warning",
    },
    {
      id: 3,
      type: "user",
      message: "New user registration: John Smith",
      time: "30 minutes ago",
      severity: "success",
    },
    {
      id: 4,
      type: "payment",
      message: "DC Fast Charging completed: ₫125,000",
      time: "1 hour ago",
      severity: "success",
    },
    {
      id: 5,
      type: "maintenance",
      message: "Maintenance scheduled for EcoPark Station - All Charging Posts",
      time: "2 hours ago",
      severity: "info",
    },
    {
      id: 6,
      type: "slot",
      message: "Slot 1 at Tech Park SuperCharger - Post C is now available",
      time: "3 hours ago",
      severity: "success",
    },
  ];

  const handleStationAction = (action, station) => {
    console.log(`${action} station:`, station.name);
    if (action === "view") {
      setSelectedStation(station);
      setOpenStationDialog(true);
    }
  };

  const getStatusChip = (status) => {
    const configs = {
      active: { label: "Active", color: "success" },
      inactive: { label: "Inactive", color: "error" },
      maintenance: { label: "Maintenance", color: "warning" },
      construction: { label: "Construction", color: "info" },
    };

    const config = configs[status] || configs.inactive;
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "success":
        return "success.main";
      case "warning":
        return "warning.main";
      case "error":
        return "error.main";
      default:
        return "info.main";
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            System Administration 🔧
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Monitor and manage the SkaEV charging network
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={() => console.log("Export report")}
          >
            Export Report
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate("/admin/stations/new")}
          >
            Add Station
          </Button>
        </Box>
      </Box>

      {/* Alert for Critical Issues */}
      <Alert severity="warning" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>System Alert:</strong> 2 stations require immediate attention.
          <Button size="small" sx={{ ml: 1 }}>
            View Details
          </Button>
        </Typography>
      </Alert>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: "linear-gradient(135deg, #1379FF 0%, #0D5FDD 100%)",
              color: "white",
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)" }}>
                  <LocationOn />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {totalStations}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total Stations
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    {activeStations} active
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
              color: "white",
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)" }}>
                  <People />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {totalUsers}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total Users
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    +12 this week
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
              color: "white",
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)" }}>
                  <ElectricCar />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {activeChargingSessions}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Active Sessions
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    {todayBookings} today
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
              color: "white",
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)" }}>
                  <MonetizationOn />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {formatCurrency(totalRevenue)}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total Revenue
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    +18% vs last month
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Station Performance Table */}
        <Grid item xs={12} md={8}>
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
                  Station Performance
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <IconButton size="small">
                    <FilterList />
                  </IconButton>
                  <IconButton size="small">
                    <Search />
                  </IconButton>
                </Box>
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Station</TableCell>
                      <TableCell align="center">Status</TableCell>
                      <TableCell align="center">Charging Posts</TableCell>
                      <TableCell align="center">Utilization</TableCell>
                      <TableCell align="center">Sessions</TableCell>
                      <TableCell align="center">Revenue</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stationPerformance.slice(0, 6).map((station) => (
                      <TableRow key={station.id} hover>
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            <Avatar
                              sx={{
                                bgcolor: "primary.main",
                                width: 40,
                                height: 40,
                              }}
                            >
                              <ElectricCar />
                            </Avatar>
                            <Box>
                              <Typography
                                variant="subtitle2"
                                fontWeight="medium"
                              >
                                {station.name}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {station.location.address}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          {getStatusChip(station.status)}
                        </TableCell>
                        <TableCell align="center">
                          <Box>
                            <Typography variant="body2" fontWeight="medium">
                              {station.chargingPostsCount} Posts
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {station.occupiedSlots}/{station.totalSlots} slots
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ minWidth: 60 }}>
                            <LinearProgress
                              variant="determinate"
                              value={station.utilization}
                              sx={{ mb: 0.5 }}
                            />
                            <Typography variant="caption">
                              {station.utilization.toFixed(0)}%
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" fontWeight="medium">
                            {station.bookingsCount}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" fontWeight="medium">
                            {formatCurrency(station.revenue)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              setAnchorEl(e.currentTarget);
                              setSelectedStation(station);
                            }}
                          >
                            <MoreVert />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
              >
                <MenuItem
                  onClick={() => {
                    handleStationAction("view", selectedStation);
                    setAnchorEl(null);
                  }}
                >
                  <Visibility sx={{ mr: 1 }} />
                  View Details
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleStationAction("edit", selectedStation);
                    setAnchorEl(null);
                  }}
                >
                  <Edit sx={{ mr: 1 }} />
                  Edit Station
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleStationAction("maintenance", selectedStation);
                    setAnchorEl(null);
                  }}
                >
                  <Settings sx={{ mr: 1 }} />
                  Schedule Maintenance
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleStationAction("delete", selectedStation);
                    setAnchorEl(null);
                  }}
                  sx={{ color: "error.main" }}
                >
                  <Delete sx={{ mr: 1 }} />
                  Delete Station
                </MenuItem>
              </Menu>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activities */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Recent Activities
              </Typography>

              <Box sx={{ maxHeight: 400, overflowY: "auto" }}>
                {recentActivities.map((activity) => (
                  <Paper
                    key={activity.id}
                    sx={{
                      p: 2,
                      mb: 2,
                      border: "1px solid",
                      borderColor: "divider",
                      borderLeft: 4,
                      borderLeftColor: getSeverityColor(activity.severity),
                    }}
                  >
                    <Typography variant="body2" gutterBottom>
                      {activity.message}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {activity.time}
                    </Typography>
                  </Paper>
                ))}
              </Box>

              <Button variant="outlined" fullWidth sx={{ mt: 2 }}>
                View All Activities
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Quick Actions
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<Analytics />}
                  fullWidth
                  onClick={() => navigate("/admin/analytics")}
                >
                  View Analytics
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<People />}
                  fullWidth
                  onClick={() => navigate("/admin/users")}
                >
                  Manage Users
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<LocationOn />}
                  fullWidth
                  onClick={() => navigate("/admin/stations")}
                >
                  Manage Stations
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Settings />}
                  fullWidth
                  onClick={() => navigate("/admin/settings")}
                >
                  System Settings
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Station Detail Dialog */}
      <Dialog
        open={openStationDialog}
        onClose={() => setOpenStationDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Station Details: {selectedStation?.name}</DialogTitle>
        <DialogContent>
          {selectedStation && (
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Location
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedStation.location.address}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Status
                  </Typography>
                  {getStatusChip(selectedStation.status)}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Charging Posts
                  </Typography>
                  <Typography variant="body2">
                    {selectedStation.chargingPostsCount} posts, {selectedStation.totalSlots} total slots
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Available Slots
                  </Typography>
                  <Typography variant="body2">
                    {selectedStation.totalSlots - selectedStation.occupiedSlots} available
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Max Power (per post)
                  </Typography>
                  <Typography variant="body2">
                    {selectedStation.charging?.chargingPosts?.[0]?.power || 'N/A'}kW
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Revenue (Month)
                  </Typography>
                  <Typography variant="body2">
                    {formatCurrency(
                      stationPerformance.find(
                        (s) => s.id === selectedStation.id
                      )?.revenue || 0
                    )}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenStationDialog(false)}>Close</Button>
          <Button variant="contained">Edit Station</Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        sx={{ position: "fixed", bottom: 24, right: 24 }}
        onClick={() => setOpenStationDialog(true)}
      >
        <Notifications />
      </Fab>
    </Box>
  );
};

export default AdminDashboard;
