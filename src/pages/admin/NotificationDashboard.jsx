import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Avatar,
  Chip,
  IconButton,
  Badge,
  Skeleton,
  Alert,
  Fade,
  Zoom,
} from "@mui/material";
import {
  Notifications,
  NotificationsActive,
  ElectricCar,
  Warning,
  Info,
  CheckCircle,
  Error,
  TrendingUp,
  LocationOn,
  People,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import useNotificationStore from "../../store/notificationStore";
import { formatDate } from "../../utils/helpers";

const NotificationDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    loading,
  } = useNotificationStore();

  const [filter, setFilter] = useState("all"); // 'all', 'unread', 'high', 'medium', 'low'

  // Filter notifications based on selected filter
  const filteredNotifications = notifications.filter((notification) => {
    switch (filter) {
      case "unread":
        return !notification.read;
      case "high":
      case "medium":
      case "low":
        return notification.priority === filter;
      default:
        return true;
    }
  });

  // Group notifications by date
  const groupedNotifications = filteredNotifications.reduce(
    (groups, notification) => {
      const date = new Date(notification.timestamp).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(notification);
      return groups;
    },
    {}
  );

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case "booking":
        return <ElectricCar />;
      case "system":
        return <Info />;
      case "maintenance":
        return <Warning />;
      case "revenue":
        return <TrendingUp />;
      case "alert":
        return <Error />;
      default:
        return <Notifications />;
    }
  };

  // Get notification color based on priority
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

  // Handle notification click
  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }

    // Navigate based on notification type
    switch (notification.type) {
      case "booking":
        navigate("/admin/dashboard");
        break;
      case "revenue":
        navigate("/admin/analytics");
        break;
      case "maintenance":
        navigate("/admin/stations");
        break;
      default:
        // Just mark as read
        break;
    }
  };

  // Statistics
  const notificationStats = {
    total: notifications.length,
    unread: unreadCount,
    high: notifications.filter((n) => n.priority === "high").length,
    medium: notifications.filter((n) => n.priority === "medium").length,
    low: notifications.filter((n) => n.priority === "low").length,
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
            Notification Center 🔔
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Stay updated with your system notifications and alerts
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            Mark All Read
          </Button>
        </Box>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card
            sx={{
              cursor: "pointer",
              border: filter === "all" ? 2 : 0,
              borderColor: "primary.main",
            }}
            onClick={() => setFilter("all")}
          >
            <CardContent sx={{ textAlign: "center" }}>
              <Avatar sx={{ bgcolor: "primary.main", mx: "auto", mb: 1 }}>
                <Notifications />
              </Avatar>
              <Typography variant="h5" fontWeight="bold">
                {notificationStats.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Card
            sx={{
              cursor: "pointer",
              border: filter === "unread" ? 2 : 0,
              borderColor: "info.main",
            }}
            onClick={() => setFilter("unread")}
          >
            <CardContent sx={{ textAlign: "center" }}>
              <Badge badgeContent={notificationStats.unread} color="error">
                <Avatar sx={{ bgcolor: "info.main", mx: "auto", mb: 1 }}>
                  <NotificationsActive />
                </Avatar>
              </Badge>
              <Typography variant="h5" fontWeight="bold">
                {notificationStats.unread}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Unread
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Card
            sx={{
              cursor: "pointer",
              border: filter === "high" ? 2 : 0,
              borderColor: "error.main",
            }}
            onClick={() => setFilter("high")}
          >
            <CardContent sx={{ textAlign: "center" }}>
              <Avatar sx={{ bgcolor: "error.main", mx: "auto", mb: 1 }}>
                <Error />
              </Avatar>
              <Typography variant="h5" fontWeight="bold">
                {notificationStats.high}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                High Priority
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Card
            sx={{
              cursor: "pointer",
              border: filter === "medium" ? 2 : 0,
              borderColor: "warning.main",
            }}
            onClick={() => setFilter("medium")}
          >
            <CardContent sx={{ textAlign: "center" }}>
              <Avatar sx={{ bgcolor: "warning.main", mx: "auto", mb: 1 }}>
                <Warning />
              </Avatar>
              <Typography variant="h5" fontWeight="bold">
                {notificationStats.medium}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Medium Priority
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Card
            sx={{
              cursor: "pointer",
              border: filter === "low" ? 2 : 0,
              borderColor: "success.main",
            }}
            onClick={() => setFilter("low")}
          >
            <CardContent sx={{ textAlign: "center" }}>
              <Avatar sx={{ bgcolor: "success.main", mx: "auto", mb: 1 }}>
                <Info />
              </Avatar>
              <Typography variant="h5" fontWeight="bold">
                {notificationStats.low}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Low Priority
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Active Filter Indicator */}
      {filter !== "all" && (
        <Fade in={true}>
          <Alert
            severity="info"
            sx={{ mb: 3 }}
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() => setFilter("all")}
              >
                Clear Filter
              </Button>
            }
          >
            Showing {filter === "unread" ? "unread" : `${filter} priority`}{" "}
            notifications only
          </Alert>
        </Fade>
      )}

      {/* Notifications List */}
      {loading ? (
        // Loading skeletons
        <Grid container spacing={2}>
          {[...Array(5)].map((_, index) => (
            <Grid item xs={12} key={index}>
              <Card>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Skeleton variant="circular" width={48} height={48} />
                    <Box sx={{ flex: 1 }}>
                      <Skeleton variant="text" width="60%" height={24} />
                      <Skeleton variant="text" width="80%" height={20} />
                      <Skeleton variant="text" width="40%" height={16} />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : Object.keys(groupedNotifications).length === 0 ? (
        // Empty state
        <Card>
          <CardContent sx={{ textAlign: "center", py: 8 }}>
            <Avatar
              sx={{
                bgcolor: "grey.100",
                mx: "auto",
                mb: 2,
                width: 64,
                height: 64,
              }}
            >
              <Notifications sx={{ fontSize: 32, color: "grey.400" }} />
            </Avatar>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No notifications found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {filter === "all"
                ? "You have no notifications at the moment"
                : `No ${
                    filter === "unread" ? "unread" : `${filter} priority`
                  } notifications`}
            </Typography>
          </CardContent>
        </Card>
      ) : (
        // Notifications grouped by date
        Object.entries(groupedNotifications).map(([date, dayNotifications]) => (
          <Box key={date} sx={{ mb: 4 }}>
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ mb: 2, color: "text.secondary" }}
            >
              {date === new Date().toDateString()
                ? "Today"
                : date === new Date(Date.now() - 86400000).toDateString()
                ? "Yesterday"
                : formatDate(date)}
            </Typography>

            <Grid container spacing={2}>
              {dayNotifications.map((notification, index) => (
                <Grid item xs={12} key={notification.id}>
                  <Zoom
                    in={true}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <Card
                      sx={{
                        cursor: "pointer",
                        opacity: notification.read ? 0.7 : 1,
                        border: !notification.read ? 1 : 0,
                        borderColor: "primary.light",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: 4,
                        },
                        transition: "all 0.3s ease",
                      }}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <CardContent>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 2,
                          }}
                        >
                          <Avatar
                            sx={{
                              bgcolor: `${getPriorityColor(
                                notification.priority
                              )}.main`,
                              width: 48,
                              height: 48,
                            }}
                          >
                            {getNotificationIcon(notification.type)}
                          </Avatar>

                          <Box sx={{ flex: 1 }}>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                mb: 1,
                              }}
                            >
                              <Typography
                                variant="h6"
                                fontWeight={
                                  notification.read ? "normal" : "bold"
                                }
                              >
                                {notification.title}
                              </Typography>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <Chip
                                  label={notification.priority}
                                  color={getPriorityColor(
                                    notification.priority
                                  )}
                                  size="small"
                                />
                                {!notification.read && (
                                  <Badge color="primary" variant="dot" />
                                )}
                              </Box>
                            </Box>

                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mb: 1 }}
                            >
                              {notification.message}
                            </Typography>

                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {formatDate(notification.timestamp)}
                              {notification.category && (
                                <Chip
                                  label={notification.category}
                                  size="small"
                                  variant="outlined"
                                  sx={{ ml: 1, height: 20 }}
                                />
                              )}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Zoom>
                </Grid>
              ))}
            </Grid>
          </Box>
        ))
      )}
    </Box>
  );
};

export default NotificationDashboard;
