import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  LinearProgress,
  Avatar,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  ElectricCar,
  LocationOn,
  Warning,
  CheckCircle,
  Build,
  Refresh,
  Add,
  Visibility,
  Edit,
} from "@mui/icons-material";

// Mock data
const mockStationData = [
  {
    id: 1,
    name: "Vincom Royal City",
    location: "Thanh Xuân, Hà Nội",
    totalChargers: 8,
    activeChargers: 6,
    maintenanceChargers: 1,
    offlineChargers: 1,
    status: "operational",
    dailyRevenue: 2850000,
    dailySessions: 24,
  },
  {
    id: 2,
    name: "AEON Mall Long Biên",
    location: "Long Biên, Hà Nội",
    totalChargers: 12,
    activeChargers: 10,
    maintenanceChargers: 2,
    offlineChargers: 0,
    status: "operational",
    dailyRevenue: 3200000,
    dailySessions: 31,
  },
  {
    id: 3,
    name: "Lotte Center",
    location: "Ba Đình, Hà Nội",
    totalChargers: 6,
    activeChargers: 4,
    maintenanceChargers: 0,
    offlineChargers: 2,
    status: "warning",
    dailyRevenue: 1850000,
    dailySessions: 18,
  },
];

const mockAlerts = [
  {
    id: 1,
    type: "maintenance",
    station: "Vincom Royal City",
    charger: "Charger #3",
    message: "Scheduled maintenance required",
    priority: "medium",
    time: "2 hours ago",
  },
  {
    id: 2,
    type: "error",
    station: "Lotte Center",
    charger: "Charger #5",
    message: "Connection error detected",
    priority: "high",
    time: "30 minutes ago",
  },
  {
    id: 3,
    type: "info",
    station: "AEON Mall Long Biên",
    charger: "Charger #8",
    message: "Maintenance completed successfully",
    priority: "low",
    time: "1 hour ago",
  },
];

const StaffDashboard = () => {
  const [stations, setStations] = useState(mockStationData);
  const [alerts, setAlerts] = useState(mockAlerts);
  const [selectedStation, setSelectedStation] = useState(null);
  const [detailsDialog, setDetailsDialog] = useState(false);
  const [maintenanceDialog, setMaintenanceDialog] = useState(false);
  const [maintenanceForm, setMaintenanceForm] = useState({
    charger: "",
    issue: "",
    notes: "",
  });

  // Calculate overall statistics
  const totalChargers = stations.reduce(
    (sum, station) => sum + station.totalChargers,
    0
  );
  const activeChargers = stations.reduce(
    (sum, station) => sum + station.activeChargers,
    0
  );
  const maintenanceChargers = stations.reduce(
    (sum, station) => sum + station.maintenanceChargers,
    0
  );
  const offlineChargers = stations.reduce(
    (sum, station) => sum + station.offlineChargers,
    0
  );
  const totalRevenue = stations.reduce(
    (sum, station) => sum + station.dailyRevenue,
    0
  );
  const totalSessions = stations.reduce(
    (sum, station) => sum + station.dailySessions,
    0
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "operational":
        return "success";
      case "warning":
        return "warning";
      case "error":
        return "error";
      default:
        return "default";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "error";
      case "medium":
        return "warning";
      case "low":
        return "info";
      default:
        return "default";
    }
  };

  const handleViewDetails = (station) => {
    setSelectedStation(station);
    setDetailsDialog(true);
  };

  const handleScheduleMaintenance = () => {
    setMaintenanceDialog(true);
  };

  const handleMaintenanceSubmit = () => {
    // Here you would typically send the maintenance request to your backend
    console.log("Maintenance request:", maintenanceForm);
    setMaintenanceDialog(false);
    setMaintenanceForm({ charger: "", issue: "", notes: "" });
    // Show success message
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Staff Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Monitor and manage charging stations
        </Typography>
      </Box>

      {/* Overview Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
                  <ElectricCar />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {totalChargers}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Chargers
                  </Typography>
                </Box>
              </Box>
              <LinearProgress
                variant="determinate"
                value={(activeChargers / totalChargers) * 100}
                sx={{ height: 8, borderRadius: 4 }}
              />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 1 }}
              >
                {activeChargers} active, {maintenanceChargers} maintenance,{" "}
                {offlineChargers} offline
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: "success.main", mr: 2 }}>
                  <CheckCircle />
                </Avatar>
                <Box>
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    color="success.main"
                  >
                    {activeChargers}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Chargers
                  </Typography>
                </Box>
              </Box>
              <Chip
                label={`${((activeChargers / totalChargers) * 100).toFixed(
                  1
                )}% Operational`}
                color="success"
                size="small"
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: "info.main", mr: 2 }}>
                  {formatCurrency(totalRevenue).slice(0, -2)}
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {formatCurrency(totalRevenue)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Today's Revenue
                  </Typography>
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary">
                From {totalSessions} charging sessions
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: "warning.main", mr: 2 }}>
                  <Warning />
                </Avatar>
                <Box>
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    color="warning.main"
                  >
                    {alerts.filter((a) => a.priority === "high").length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    High Priority Alerts
                  </Typography>
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary">
                {alerts.length} total alerts
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Station Status Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography variant="h6" fontWeight="bold">
                  Station Status Overview
                </Typography>
                <Button
                  startIcon={<Refresh />}
                  onClick={() => window.location.reload()}
                >
                  Refresh
                </Button>
              </Box>

              <Grid container spacing={2}>
                {stations.map((station) => (
                  <Grid item xs={12} md={4} key={station.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            mb: 2,
                          }}
                        >
                          <Box>
                            <Typography variant="h6" fontWeight="bold">
                              {station.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              <LocationOn sx={{ fontSize: 16, mr: 0.5 }} />
                              {station.location}
                            </Typography>
                          </Box>
                          <Chip
                            label={station.status}
                            color={getStatusColor(station.status)}
                            size="small"
                          />
                        </Box>

                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" gutterBottom>
                            Chargers: {station.activeChargers}/
                            {station.totalChargers} active
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={
                              (station.activeChargers / station.totalChargers) *
                              100
                            }
                            sx={{ height: 6, borderRadius: 3, mb: 1 }}
                          />
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Revenue: {formatCurrency(station.dailyRevenue)}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Sessions: {station.dailySessions}
                            </Typography>
                          </Box>
                        </Box>

                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Button
                            size="small"
                            startIcon={<Visibility />}
                            onClick={() => handleViewDetails(station)}
                          >
                            Details
                          </Button>
                          <Button
                            size="small"
                            startIcon={<Build />}
                            onClick={handleScheduleMaintenance}
                          >
                            Maintenance
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Alerts Section */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Recent Alerts
              </Typography>
              {alerts.map((alert) => (
                <Alert
                  key={alert.id}
                  severity={
                    alert.priority === "high"
                      ? "error"
                      : alert.priority === "medium"
                      ? "warning"
                      : "info"
                  }
                  sx={{ mb: 1 }}
                  action={
                    <IconButton size="small">
                      <Edit />
                    </IconButton>
                  }
                >
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      {alert.station} - {alert.charger}
                    </Typography>
                    <Typography variant="body2">{alert.message}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {alert.time}
                    </Typography>
                  </Box>
                </Alert>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Station Details Dialog */}
      <Dialog
        open={detailsDialog}
        onClose={() => setDetailsDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Station Details - {selectedStation?.name}</DialogTitle>
        <DialogContent>
          {selectedStation && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Location
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {selectedStation.location}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Status
                </Typography>
                <Chip
                  label={selectedStation.status}
                  color={getStatusColor(selectedStation.status)}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Total Chargers
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedStation.totalChargers}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Active Chargers
                </Typography>
                <Typography variant="body2" color="success.main">
                  {selectedStation.activeChargers}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Daily Revenue
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatCurrency(selectedStation.dailyRevenue)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Daily Sessions
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedStation.dailySessions}
                </Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Maintenance Dialog */}
      <Dialog
        open={maintenanceDialog}
        onClose={() => setMaintenanceDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Schedule Maintenance</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Charger ID"
              value={maintenanceForm.charger}
              onChange={(e) =>
                setMaintenanceForm({
                  ...maintenanceForm,
                  charger: e.target.value,
                })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Issue Description"
              value={maintenanceForm.issue}
              onChange={(e) =>
                setMaintenanceForm({
                  ...maintenanceForm,
                  issue: e.target.value,
                })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Additional Notes"
              value={maintenanceForm.notes}
              onChange={(e) =>
                setMaintenanceForm({
                  ...maintenanceForm,
                  notes: e.target.value,
                })
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMaintenanceDialog(false)}>Cancel</Button>
          <Button onClick={handleMaintenanceSubmit} variant="contained">
            Schedule
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StaffDashboard;
