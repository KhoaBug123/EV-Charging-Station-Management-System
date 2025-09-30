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
import { getText } from "../../../utils/vietnameseTexts";

const drawerWidth = 260;

const Sidebar = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();

  const getNavigationItems = () => {
    switch (user?.role) {
      case "admin":
        return [
          { text: getText("nav.dashboard"), icon: <Dashboard />, path: "/admin/dashboard" },
          {
            text: getText("nav.advancedAnalytics"),
            icon: <Analytics />,
            path: "/admin/analytics",
          },
          {
            text: getText("nav.stationManagement"),
            icon: <LocationOn />,
            path: "/admin/stations",
          },
          {
            text: getText("nav.notifications"),
            icon: <Notifications />,
            path: "/admin/notifications",
          },
          { text: getText("nav.userManagement"), icon: <People />, path: "/admin/users" },
          {
            text: getText("nav.systemReports"),
            icon: <Analytics />,
            path: "/admin/reports",
          },
          { text: getText("nav.settings"), icon: <Settings />, path: "/admin/settings" },
        ];

      case "staff":
        return [
          { text: getText("nav.dashboard"), icon: <Dashboard />, path: "/staff/dashboard" },
          {
            text: getText("nav.stationManagement"),
            icon: <LocationOn />,
            path: "/staff/stations",
          },
          { text: getText("nav.profile"), icon: <Person />, path: "/staff/profile" },
        ];

      case "customer":
        return [
          {
            text: "Trang chủ",
            icon: <Dashboard />,
            path: "/customer/dashboard",
          },
          // a. Quản lý tài khoản
          {
            text: "Hồ sơ cá nhân",
            icon: <Person />,
            path: "/customer/profile",
            category: "account"
          },
          {
            text: "Quản lý xe",
            icon: <ElectricCar />,
            path: "/customer/vehicles",
            category: "account"
          },
          // b. Đặt chỗ & sạc
          {
            text: "Tìm trạm sạc",
            icon: <LocationOn />,
            path: "/customer/find-stations",
            category: "charging"
          },
          {
            text: "Quét QR sạc",
            icon: <Business />,
            path: "/qr-demo",
            category: "charging"
          },
          // c. Thanh toán
          {
            text: "Thanh toán",
            icon: <Payment />,
            path: "/customer/payment",
            category: "payment"
          },
          // d. Lịch sử & báo cáo
          {
            text: "Lịch sử sạc",
            icon: <History />,
            path: "/customer/history",
            category: "history"
          },
          {
            text: "Thống kê & Báo cáo Chi phí",
            icon: <Analytics />,
            path: "/customer/analytics",
            category: "history"
          },
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
            {getText("nav.welcome")}, {user.profile?.firstName}
          </Typography>
        )}
      </Box>

      {/* Navigation Menu */}
      <List sx={{ px: 2, py: 1 }}>
        {user?.role === "customer" ? (
          <>
            {/* Trang chủ */}
            {navigationItems.filter(item => !item.category).map((item) => (
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

            <Divider sx={{ my: 2 }} />

            {/* Quản lý tài khoản */}
            <Typography variant="overline" sx={{ px: 2, py: 1, color: "text.secondary", fontWeight: 600 }}>
              Tài khoản
            </Typography>
            {navigationItems.filter(item => item.category === "account").map((item) => (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  selected={isActivePath(item.path)}
                  sx={{
                    borderRadius: 2,
                    pl: 2,
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
                  <ListItemIcon sx={{ minWidth: 35 }}>{item.icon}</ListItemIcon>
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

            {/* Sạc xe */}
            <Typography variant="overline" sx={{ px: 2, py: 1, mt: 2, color: "text.secondary", fontWeight: 600 }}>
              Sạc xe
            </Typography>
            {navigationItems.filter(item => item.category === "charging").map((item) => (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  selected={isActivePath(item.path)}
                  sx={{
                    borderRadius: 2,
                    pl: 2,
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
                  <ListItemIcon sx={{ minWidth: 35 }}>{item.icon}</ListItemIcon>
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

            {/* Thanh toán */}
            {navigationItems.filter(item => item.category === "payment").map((item) => (
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

            {/* Lịch sử & báo cáo */}
            <Typography variant="overline" sx={{ px: 2, py: 1, mt: 2, color: "text.secondary", fontWeight: 600 }}>
              Báo cáo
            </Typography>
            {navigationItems.filter(item => item.category === "history").map((item) => (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  selected={isActivePath(item.path)}
                  sx={{
                    borderRadius: 2,
                    pl: 2,
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
                  <ListItemIcon sx={{ minWidth: 35 }}>{item.icon}</ListItemIcon>
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
          </>
        ) : (
          // For other roles (admin, staff)
          <>
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
          </>
        )}
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
