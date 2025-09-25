import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
} from "@mui/material";
import {
  Dashboard,
  LocationOn,
  History,
  Payment,
  Person,
  Business,
  Analytics,
  People,
  Settings,
  ElectricCar,
  Notifications,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import useAuthStore from "../../../store/authStore";

const drawerWidth = 260;

const Sidebar = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();

  const getNavigationItems = () => {
    switch (user?.role) {
      case "admin":
        return [
          { text: "Dashboard", icon: <Dashboard />, path: "/admin/dashboard" },
          {
            text: "Advanced Analytics",
            icon: <Analytics />,
            path: "/admin/analytics",
          },
          {
            text: "Station Management",
            icon: <LocationOn />,
            path: "/admin/stations",
          },
          {
            text: "Notifications",
            icon: <Notifications />,
            path: "/admin/notifications",
          },
          { text: "User Management", icon: <People />, path: "/admin/users" },
          {
            text: "System Reports",
            icon: <Analytics />,
            path: "/admin/reports",
          },
          { text: "Settings", icon: <Settings />, path: "/admin/settings" },
        ];

      case "staff":
        return [
          { text: "Dashboard", icon: <Dashboard />, path: "/staff/dashboard" },
          {
            text: "Station Management",
            icon: <LocationOn />,
            path: "/staff/stations",
          },
          { text: "Profile", icon: <Person />, path: "/staff/profile" },
        ];

      case "customer":
        return [
          {
            text: "Find Stations",
            icon: <LocationOn />,
            path: "/customer/find-stations",
          },
          {
            text: "Booking History",
            icon: <History />,
            path: "/customer/history",
          },
          {
            text: "Payment Methods",
            icon: <Payment />,
            path: "/customer/payment",
          },
          { text: "Profile", icon: <Person />, path: "/customer/profile" },
        ];

      default:
        return [];
    }
  };

  const navigationItems = getNavigationItems();

  const handleNavigation = (path) => {
    navigate(path);
    if (onClose) onClose();
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const drawerContent = (
    <Box
      sx={{ width: drawerWidth, height: "100%", bgcolor: "background.paper" }}
    >
      {/* Sidebar Header */}
      <Box sx={{ p: 3, borderBottom: 1, borderColor: "divider" }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <ElectricCar sx={{ color: "primary.main", mr: 1 }} />
          <Typography variant="h6" fontWeight="bold">
            SkaEV
          </Typography>
        </Box>
        {user && (
          <Typography variant="body2" color="text.secondary">
            Welcome, {user.profile?.firstName}
          </Typography>
        )}
      </Box>

      {/* Navigation Menu */}
      <List sx={{ px: 2, py: 1 }}>
        {navigationItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              selected={isActivePath(item.path)}
              sx={{
                borderRadius: 2,
                "&.Mui-selected": {
                  backgroundColor: "primary.main",
                  color: "white",
                  "& .MuiListItemIcon-root": {
                    color: "white",
                  },
                  "&:hover": {
                    backgroundColor: "primary.dark",
                  },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: "0.9rem",
                  fontWeight: isActivePath(item.path) ? 600 : 400,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ mx: 2, my: 2 }} />
    </Box>
  );

  return (
    <>
      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            position: "relative",
            height: "calc(100vh - 64px)", // Subtract header height
            borderRight: 1,
            borderColor: "divider",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Sidebar;
