import React, { useState, useEffect } from "react";
import {
  Box,
  Drawer,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Button,
  Badge,
  Avatar,
  Divider,
  FormGroup,
  FormControlLabel,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Alert,
  Tooltip,
  Fab,
  Slide,
  Collapse,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  Close,
  Settings as SettingsIcon,
  CheckCircle,
  Warning,
  Info,
  Error,
  Schedule,
  ElectricCar,
  Payment,
  Build,
  MarkEmailRead,
  Delete,
  VolumeUp,
  VolumeOff,
  Circle,
  MoreVert,
  Refresh,
} from "@mui/icons-material";
import { formatDistance } from "date-fns";
import useNotificationStore from "../store/notificationStore";

const NotificationCenter = () => {
  const {
    notifications,
    unreadCount,
    settings,
    isConnected,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    updateSettings,
    loadSettings,
    connect,
    disconnect,
    sendChargingCompleteNotification,
    sendBookingReminderNotification,
    sendPaymentNotification,
    sendMaintenanceNotification,
  } = useNotificationStore();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [testMode, setTestMode] = useState(false);

  useEffect(() => {
    // Load settings on mount
    loadSettings();

    // Auto-connect to notification service
    connect();

    // Cleanup on unmount
    return () => {
      disconnect();
    };
  }, []);

  const getNotificationIcon = (type, category) => {
    const iconProps = { sx: { fontSize: 20 } };

    if (category === "charging")
      return <ElectricCar color="primary" {...iconProps} />;
    if (category === "booking") return <Schedule color="info" {...iconProps} />;
    if (category === "payment")
      return <Payment color="success" {...iconProps} />;
    if (category === "maintenance")
      return <Build color="warning" {...iconProps} />;

    switch (type) {
      case "success":
        return <CheckCircle color="success" {...iconProps} />;
      case "warning":
        return <Warning color="warning" {...iconProps} />;
      case "error":
        return <Error color="error" {...iconProps} />;
      default:
        return <Info color="info" {...iconProps} />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "success":
        return "success.light";
      case "warning":
        return "warning.light";
      case "error":
        return "error.light";
      default:
        return "info.light";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "error.main";
      case "medium":
        return "warning.main";
      default:
        return "info.main";
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }

    // Handle notification actions
    if (notification.actions && notification.actions[0]) {
      console.log("Executing action:", notification.actions[0].action);
      // Here you would navigate or perform the action
    }
  };

  const handleSettingChange = (setting, value) => {
    updateSettings({ [setting]: value });
  };

  // Test notification functions
  const sendTestNotifications = () => {
    setTimeout(() => {
      sendChargingCompleteNotification("Test Station", { energy: 45.2 });
    }, 1000);

    setTimeout(() => {
      sendBookingReminderNotification("Test Hub", 15);
    }, 2000);

    setTimeout(() => {
      sendPaymentNotification("₫125,000", "success");
    }, 3000);

    setTimeout(() => {
      sendMaintenanceNotification("Test Station", "tonight 2:00 AM - 6:00 AM");
    }, 4000);
  };

  return (
    <>
      {/* Notification Bell */}
      <Tooltip title={`${unreadCount} unread notifications`}>
        <IconButton
          onClick={() => setDrawerOpen(true)}
          sx={{ position: "relative" }}
        >
          <Badge badgeContent={unreadCount} color="error" max={99}>
            <NotificationsIcon />
          </Badge>
          {/* Connection indicator */}
          <Circle
            sx={{
              position: "absolute",
              top: 5,
              right: 5,
              fontSize: 8,
              color: isConnected ? "success.main" : "error.main",
            }}
          />
        </IconButton>
      </Tooltip>

      {/* Notification Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: { width: { xs: "100%", sm: 400, md: 450 } },
        }}
      >
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
          {/* Header */}
          <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6" fontWeight="bold">
                Notifications
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Tooltip title="Settings">
                  <IconButton
                    size="small"
                    onClick={() => setSettingsOpen(true)}
                  >
                    <SettingsIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title={isConnected ? "Connected" : "Reconnect"}>
                  <IconButton
                    size="small"
                    onClick={isConnected ? disconnect : connect}
                    color={isConnected ? "success" : "error"}
                  >
                    <Refresh />
                  </IconButton>
                </Tooltip>
                <IconButton size="small" onClick={() => setDrawerOpen(false)}>
                  <Close />
                </IconButton>
              </Box>
            </Box>

            {/* Action buttons */}
            <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
              <Button
                size="small"
                variant="outlined"
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                startIcon={<MarkEmailRead />}
              >
                Mark All Read
              </Button>
              <Button
                size="small"
                variant="outlined"
                color="error"
                onClick={clearAllNotifications}
                disabled={notifications.length === 0}
                startIcon={<Delete />}
              >
                Clear All
              </Button>
            </Box>

            {/* Connection status */}
            <Alert
              severity={isConnected ? "success" : "warning"}
              sx={{ mt: 2 }}
              variant="outlined"
            >
              {isConnected
                ? "🟢 Real-time notifications active"
                : "🔴 Connecting to notification service..."}
            </Alert>
          </Box>

          {/* Notifications List */}
          <Box sx={{ flex: 1, overflow: "auto" }}>
            {notifications.length === 0 ? (
              <Box sx={{ p: 4, textAlign: "center" }}>
                <NotificationsIcon
                  sx={{ fontSize: 60, color: "text.secondary", mb: 2 }}
                />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No notifications yet
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  We'll notify you when something important happens
                </Typography>
                <Button
                  variant="contained"
                  onClick={sendTestNotifications}
                  disabled={testMode}
                >
                  Send Test Notifications
                </Button>
              </Box>
            ) : (
              <List sx={{ p: 0 }}>
                {notifications.map((notification, index) => (
                  <React.Fragment key={notification.id}>
                    <ListItem
                      button
                      onClick={() => handleNotificationClick(notification)}
                      sx={{
                        py: 2,
                        backgroundColor: notification.read
                          ? "transparent"
                          : "action.hover",
                        borderLeft: 4,
                        borderLeftColor: notification.read
                          ? "transparent"
                          : getPriorityColor(notification.priority),
                        "&:hover": {
                          backgroundColor: "action.selected",
                        },
                      }}
                    >
                      <ListItemIcon>
                        <Avatar
                          sx={{
                            bgcolor: getNotificationColor(notification.type),
                            color: "white",
                            width: 40,
                            height: 40,
                          }}
                        >
                          {getNotificationIcon(
                            notification.type,
                            notification.category
                          )}
                        </Avatar>
                      </ListItemIcon>

                      <ListItemText
                        primary={
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "start",
                              gap: 1,
                            }}
                          >
                            <Typography
                              variant="subtitle2"
                              fontWeight={notification.read ? "normal" : "bold"}
                              sx={{ flex: 1 }}
                            >
                              {notification.title}
                            </Typography>
                            {!notification.read && (
                              <Circle
                                sx={{
                                  fontSize: 8,
                                  color: "primary.main",
                                  mt: 0.5,
                                }}
                              />
                            )}
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mb: 0.5 }}
                            >
                              {notification.message}
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {formatDistance(
                                  new Date(notification.timestamp),
                                  new Date(),
                                  { addSuffix: true }
                                )}
                              </Typography>
                              {notification.priority === "high" && (
                                <Chip
                                  label="High Priority"
                                  color="error"
                                  size="small"
                                />
                              )}
                            </Box>

                            {/* Action buttons */}
                            {notification.actions && (
                              <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
                                {notification.actions.map(
                                  (action, actionIndex) => (
                                    <Button
                                      key={actionIndex}
                                      size="small"
                                      variant="outlined"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        console.log(
                                          "Action clicked:",
                                          action.action
                                        );
                                      }}
                                    >
                                      {action.label}
                                    </Button>
                                  )
                                )}
                              </Box>
                            )}
                          </Box>
                        }
                      />

                      <ListItemSecondaryAction>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeNotification(notification.id);
                          }}
                        >
                          <Close fontSize="small" />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    {index < notifications.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </Box>
        </Box>
      </Drawer>

      {/* Settings Dialog */}
      <Dialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Notification Settings</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Customize how and when you receive notifications
          </Typography>

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Delivery Methods
              </Typography>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.browser}
                      onChange={(e) =>
                        handleSettingChange("browser", e.target.checked)
                      }
                    />
                  }
                  label={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <NotificationsIcon fontSize="small" />
                      Browser Notifications
                    </Box>
                  }
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.email}
                      onChange={(e) =>
                        handleSettingChange("email", e.target.checked)
                      }
                    />
                  }
                  label="Email Notifications"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.sms}
                      onChange={(e) =>
                        handleSettingChange("sms", e.target.checked)
                      }
                    />
                  }
                  label="SMS Notifications"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.sound}
                      onChange={(e) =>
                        handleSettingChange("sound", e.target.checked)
                      }
                    />
                  }
                  label={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {settings.sound ? (
                        <VolumeUp fontSize="small" />
                      ) : (
                        <VolumeOff fontSize="small" />
                      )}
                      Sound Alerts
                    </Box>
                  }
                />
              </FormGroup>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Notification Categories
              </Typography>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.charging}
                      onChange={(e) =>
                        handleSettingChange("charging", e.target.checked)
                      }
                    />
                  }
                  label={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <ElectricCar fontSize="small" />
                      Charging Updates
                    </Box>
                  }
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.booking}
                      onChange={(e) =>
                        handleSettingChange("booking", e.target.checked)
                      }
                    />
                  }
                  label={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Schedule fontSize="small" />
                      Booking Reminders
                    </Box>
                  }
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.payment}
                      onChange={(e) =>
                        handleSettingChange("payment", e.target.checked)
                      }
                    />
                  }
                  label={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Payment fontSize="small" />
                      Payment Alerts
                    </Box>
                  }
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.maintenance}
                      onChange={(e) =>
                        handleSettingChange("maintenance", e.target.checked)
                      }
                    />
                  }
                  label={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Build fontSize="small" />
                      Maintenance Notices
                    </Box>
                  }
                />
              </FormGroup>
            </CardContent>
          </Card>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setSettingsOpen(false)}>
            Save Settings
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default NotificationCenter;
