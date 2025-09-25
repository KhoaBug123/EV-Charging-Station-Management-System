import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  useTheme,
} from "@mui/material";
import {
  ElectricCar,
  Speed,
  Nature,
  Security,
  LocationOn,
  TrendingUp,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";

const HomePage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { isAuthenticated, user } = useAuthStore();

  const features = [
    {
      icon: <Speed sx={{ fontSize: 40, color: "primary.main" }} />,
      title: "Fast Charging",
      description: "Ultra-fast DC charging up to 250kW for quick top-ups",
    },
    {
      icon: <LocationOn sx={{ fontSize: 40, color: "success.main" }} />,
      title: "Wide Network",
      description: "Extensive network of charging stations across the city",
    },
    {
      icon: <Nature sx={{ fontSize: 40, color: "secondary.main" }} />,
      title: "Green Energy",
      description: "100% renewable energy sources for sustainable charging",
    },
    {
      icon: <Security sx={{ fontSize: 40, color: "info.main" }} />,
      title: "Secure Payments",
      description: "Safe and secure payment processing with multiple options",
    },
  ];

  const stats = [
    { label: "Active Stations", value: "50+", color: "primary" },
    { label: "Happy Customers", value: "1,200+", color: "success" },
    { label: "Charging Sessions", value: "25,000+", color: "warning" },
    { label: "CO₂ Saved", value: "150T+", color: "secondary" },
  ];

  const handleGetStarted = () => {
    if (isAuthenticated) {
      // Redirect to appropriate dashboard/main page
      const redirectPath = {
        admin: "/admin/dashboard",
        staff: "/staff/dashboard",
        customer: "/customer/find-stations", // Customer goes to find stations instead of dashboard
      }[user?.role];
      if (redirectPath) navigate(redirectPath);
    } else {
      navigate("/login");
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100vw",
        overflowX: "hidden",
        m: 0,
        p: 0,
        minHeight: "100vh",
        position: "relative",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #1379FF 0%, #B5FF3D 100%)",
          color: "white",
          position: "relative",
          overflow: "hidden",
          width: "100%",
        }}
      >
        {/* Navigation */}
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              py: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <ElectricCar sx={{ fontSize: 32, mr: 1 }} />
              <Typography variant="h5" fontWeight="bold">
                SkaEV
              </Typography>
            </Box>

            {!isAuthenticated && (
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={() => navigate("/login")}
                  sx={{
                    borderColor: "rgba(255,255,255,0.5)",
                    "&:hover": {
                      borderColor: "white",
                      backgroundColor: "rgba(255,255,255,0.1)",
                    },
                  }}
                >
                  Đăng nhập
                </Button>
                <Button
                  variant="contained"
                  onClick={() => navigate("/register")}
                  sx={{
                    backgroundColor: "#B5FF3D",
                    color: "#000000",
                    fontWeight: "bold",
                    border: "1px solid #B5FF3D",
                    textShadow: "0 1px 2px rgba(0,0,0,0.1)",
                    "&:hover": {
                      backgroundColor: "#9FE830",
                      color: "#000000",
                      transform: "translateY(-1px)",
                      boxShadow: "0 4px 12px rgba(181, 255, 61, 0.4)",
                    },
                  }}
                >
                  Đăng ký
                </Button>
              </Box>
            )}
          </Box>
        </Container>

        {/* Hero Section */}
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h2"
                fontWeight="bold"
                gutterBottom
                sx={{ fontSize: { xs: "2.5rem", md: "3.5rem" } }}
              >
                Smart EV Charging Network
              </Typography>
              <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                Manage your electric vehicle charging stations efficiently with
                our comprehensive platform. Real-time monitoring, smart booking,
                and seamless payments.
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  flexWrap: "wrap",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: { xs: "stretch", sm: "center" },
                }}
              >
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleGetStarted}
                  sx={{
                    backgroundColor: "#B5FF3D",
                    color: "#1a1a1a",
                    fontWeight: "bold",
                    "&:hover": {
                      backgroundColor: "#9FE830",
                      color: "#000000",
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 25px rgba(181, 255, 61, 0.3)",
                    },
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 15px rgba(181, 255, 61, 0.2)",
                  }}
                >
                  {isAuthenticated
                    ? user?.role === "customer"
                      ? "Tìm trạm sạc"
                      : "Vào Dashboard"
                    : "Bắt đầu ngay"}
                </Button>

                {!isAuthenticated && (
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate("/register")}
                    sx={{
                      backgroundColor: "#FF6B35",
                      color: "#ffffff",
                      fontWeight: "bold",
                      border: "none",
                      fontSize: "1.1rem",
                      textShadow: "0 1px 2px rgba(0,0,0,0.2)",
                      "&:hover": {
                        backgroundColor: "#E55A2B",
                        color: "#ffffff",
                        border: "none",
                        transform: "translateY(-2px)",
                        boxShadow: "0 8px 25px rgba(255, 107, 53, 0.4)",
                      },
                      transition: "all 0.3s ease",
                      boxShadow: "0 4px 15px rgba(255, 107, 53, 0.3)",
                    }}
                  >
                    Đăng ký miễn phí
                  </Button>
                )}
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  textAlign: "center",
                  position: "relative",
                  width: "100%",
                  height: { xs: "200px", md: "300px" },
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                <ElectricCar
                  sx={{
                    fontSize: { xs: 150, md: 250 },
                    opacity: 0.3,
                    animation: "float 3s ease-in-out infinite",
                    color: "rgba(255, 255, 255, 0.8)",
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={3}>
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Card
                sx={{
                  textAlign: "center",
                  height: "100%",
                  border: 1,
                  borderColor: "grey.200",
                  "&:hover": {
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent>
                  <Typography
                    variant="h3"
                    fontWeight="bold"
                    color={`${stat.color}.main`}
                    gutterBottom
                  >
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.label}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features Section */}
      <Box sx={{ backgroundColor: "grey.50", py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              Why Choose SkaEV?
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Advanced features for modern EV charging management
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  sx={{
                    height: "100%",
                    textAlign: "center",
                    p: 2,
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 6,
                      transition: "all 0.3s ease",
                    },
                  }}
                >
                  <CardContent>
                    <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container maxWidth="lg" sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Ready to Start Charging?
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Join thousands of EV drivers using SkaEV charging network
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Chip label="Customer" color="success" />
          <Chip label="Staff" color="info" />
          <Chip label="Administrator" color="error" />
        </Box>

        <Button
          variant="contained"
          size="large"
          onClick={handleGetStarted}
          sx={{
            mt: 3,
            backgroundColor: "#1379FF",
            color: "white",
            fontWeight: "bold",
            "&:hover": {
              backgroundColor: "#0056CC",
              transform: "translateY(-2px)",
              boxShadow: "0 8px 25px rgba(19, 121, 255, 0.3)",
            },
            transition: "all 0.3s ease",
            boxShadow: "0 4px 15px rgba(19, 121, 255, 0.2)",
          }}
        >
          {isAuthenticated ? "Go to Dashboard" : "Get Started Today"}
        </Button>
      </Container>

      {/* Footer */}
      <Box sx={{ backgroundColor: "grey.900", color: "white", py: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              SkaEV
            </Typography>
            <Typography variant="body2" color="grey.400">
              © 2024 SkaEV. Electric Vehicle Charging Management Platform.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Animation Keyframes */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
        `}
      </style>
    </Box>
  );
};

export default HomePage;
