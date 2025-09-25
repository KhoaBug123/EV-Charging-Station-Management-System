import React, { useState } from "react";
import { Box, IconButton, useTheme, useMediaQuery } from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { Outlet } from "react-router-dom";

import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";

const AppLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Header */}
      <Header />

      {/* Main Content Area */}
      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Mobile Menu Button */}
        {isMobile && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              position: "fixed",
              top: 72,
              left: 8,
              zIndex: theme.zIndex.drawer + 1,
              backgroundColor: "background.paper",
              boxShadow: 2,
              "&:hover": {
                backgroundColor: "grey.100",
              },
            }}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Sidebar */}
        <Sidebar open={mobileOpen} onClose={handleDrawerToggle} />

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { md: "calc(100% - 260px)" }, // Account for sidebar width
            height: "calc(100vh - 64px)", // Account for header height
            overflow: "auto",
            backgroundColor: "grey.50",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default AppLayout;
