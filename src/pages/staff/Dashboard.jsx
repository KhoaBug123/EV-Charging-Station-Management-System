/* eslint-disable */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  Alert,
  AlertTitle,
  Chip,
  Divider,
  Stack,
  CircularProgress,
} from "@mui/material";
import {
  ElectricCar,
  BatteryChargingFull,
  Warning,
  CheckCircle,
  Build,
  PowerOff,
  Refresh,
  Notifications,
  Error,
  Bolt,
  AccessTime,
  MonetizationOn,
} from "@mui/icons-material";
import staffService from "../../services/staffService";
import { formatCurrency } from "../../utils/helpers";

const StaffDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [stationInfo, setStationInfo] = useState(null);
  const [connectors, setConnectors] = useState([]);
  const [dailyStats, setDailyStats] = useState({
    revenue: 0,
    completedSessions: 0,
    energyConsumed: 0,
  });
  const [alerts, setAlerts] = useState([]);
  const [activeSessions, setActiveSessions] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await staffService.getDashboardData();
      
      console.log('📊 Staff Dashboard Data:', data);

      // Set stations
      const stationsList = data.stations || [];
      setStations(stationsList);
      
      // Auto-select first station if available
      if (stationsList.length > 0 && !selectedStation) {
        const firstStation = stationsList[0];
        setSelectedStation(firstStation);
        await loadStationDetails(firstStation.stationId);
      }

      // Set daily stats
      setDailyStats(data.dailyStats || {
        revenue: 0,
        completedSessions: 0,
        energyConsumed: 0,
      });

      // Set alerts from issues
      setAlerts(data.alerts || []);

      // Set active sessions
      setActiveSessions(data.activeSessions || []);

    } catch (error) {
      console.error("Error loading dashboard:", error);
      setError(error.message || "Không thể tải dữ liệu dashboard");
    } finally {
      setLoading(false);
    }
  };

  const loadStationDetails = async (stationId) => {
    try {
      const stationData = await staffService.getStationWithLiveData(stationId);
      console.log('🔌 Station Details:', stationData);

      // Set station info
      setStationInfo({
        name: stationData.name || 'Unknown Station',
        address: stationData.address || '',
        staffName: stationData.staffName || 'Staff Member'
      });

      // Map slots to connectors format
      const mappedConnectors = (stationData.slots || []).map((slot, index) => ({
        id: slot.slotId || `SLOT-${index + 1}`,
        stationId: slot.stationId,
        name: `Cổng ${index + 1}`,
        type: slot.connectorType || "AC",
        maxPower: slot.maxPower || 22,
        status: slot.status || "available",
        statusLabel: getStatusLabel(slot.status),
        statusColor: getStatusColor(slot.status),
        currentSession: slot.currentBooking || null,
      }));

      setConnectors(mappedConnectors);
    } catch (error) {
      console.error("Error loading station details:", error);
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      available: "Rảnh",
      occupied: "Đang sạc",
      faulted: "Lỗi",
      maintenance: "Bảo trì",
      offline: "Ngoại tuyến",
    };
    return labels[status] || status;
  };

  const getStatusColor = (status) => {
    const colors = {
      available: "success",
      occupied: "primary",
      faulted: "error",
      maintenance: "warning",
      offline: "default",
    };
    return colors[status] || "default";
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Available":
        return <CheckCircle color="success" />;
      case "Charging":
        return <BatteryChargingFull color="primary" />;
      case "Faulted":
        return <Warning color="error" />;
      case "Unavailable":
        return <PowerOff color="disabled" />;
      default:
        return <Build color="warning" />;
    }
  };

  // Statistics
  const totalConnectors = connectors.length;
  const availableConnectors = connectors.filter((c) => c.status === "Available").length;
  const chargingConnectors = connectors.filter((c) => c.status === "Charging").length;
  const faultedConnectors = connectors.filter((c) => c.status === "Faulted").length;
  const onlineConnectors = connectors.filter((c) => c.status === "Available" || c.status === "Charging").length;
  const offlineConnectors = connectors.filter((c) => c.status === "Faulted" || c.status === "Unavailable").length;

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Quản lý Trạm sạc
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {stationInfo?.name} - {stationInfo?.address}
          </Typography>
        </Box>
        <Button variant="outlined" startIcon={<Refresh />} onClick={loadDashboardData}>
          Làm mới
        </Button>
      </Box>

      {/* Staff Info Alert */}
      {stationInfo && (
        <Alert severity="info" icon={<ElectricCar />} sx={{ mb: 3 }}>
          Nhân viên: <strong>{stationInfo.staffName}</strong> - Trạm:{" "}
          <strong>{stationInfo.name}</strong>
        </Alert>
      )}

      {/* Statistics Cards - THAY THẾ VÀ SẮP XẾP LẠI CÁC CHỈ SỐ */}
      <Grid container spacing={3} mb={3}>
        {/* Doanh thu hôm nay */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <MonetizationOn color="success" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="success.main">
                    {dailyStats.revenue.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Doanh thu hôm nay (VNĐ)
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Phiên hoàn thành */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <CheckCircle color="primary" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="primary.main">
                    {dailyStats.completedSessions}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Phiên hoàn thành
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Năng lượng tiêu thụ */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Bolt color="warning" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="warning.main">
                    {dailyStats.energyConsumed.toFixed(1)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Năng lượng tiêu thụ (kWh)
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Số lượng Xe đang sạc - Thay thế "Tích hợp bình chỗ sạc" */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <BatteryChargingFull color="info" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="info.main">
                    {chargingConnectors}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Số lượng Xe đang sạc
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* THÊM PHẦN BÁO LỖI - Đặt thẻ Báo lỗi */}
      <Typography variant="h5" fontWeight={600} mb={2}>
        Báo lỗi
      </Typography>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          {alerts.length === 0 ? (
            <Alert severity="success" icon={<CheckCircle />}>
              Không có lỗi nào. Tất cả điểm sạc đang hoạt động bình thường.
            </Alert>
          ) : (
            <Stack spacing={2}>
              {alerts.map((alert) => (
                <Alert
                  key={alert.id}
                  severity={alert.type}
                  icon={alert.type === "warning" ? <Warning /> : alert.type === "error" ? <Error /> : <Notifications />}
                  action={
                    <Button
                      size="small"
                      onClick={() => {
                        // Điểm sạc Offline (hiện tại là 1) và Điểm sạc có lỗi/Cảnh báo
                        if (alert.type === "warning" && alert.message.includes("Offline")) {
                          navigate("/staff/monitoring");
                        } else {
                          navigate("/staff/charging-sessions");
                        }
                      }}
                    >
                      Chi tiết
                    </Button>
                  }
                >
                  <AlertTitle sx={{ fontWeight: 600 }}>
                    {alert.type === "warning" ? "Cảnh báo" : alert.type === "error" ? "Lỗi" : "Thông báo"}
                  </AlertTitle>
                  <Typography variant="body2">{alert.message}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {alert.timestamp.toLocaleString("vi-VN")}
                  </Typography>
                </Alert>
              ))}
            </Stack>
          )}
        </CardContent>
      </Card>

      {/* DANH SÁCH ĐIỂM SẠC - Góp thành một danh sách duy nhất và dùng ký hiệu trực quan */}
      <Typography variant="h5" fontWeight={600} mb={2}>
        Danh sách Điểm sạc
      </Typography>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Liệt kê tất cả các Điểm sạc (CON-01, CON-02, CON-03, CON-04) theo thứ tự và sử dụng{" "}
            <strong>màu sắc/biểu tượng lớn hơn</strong> để thể hiện trạng thái (Xanh lá – Rảnh, Xanh dương = Đang sạc, 
            Đỏ = Lỗi/Offline).
          </Typography>
          <Grid container spacing={2}>
            {connectors.map((connector) => {
              // Xác định màu và biểu tượng dựa trên status
              let cardBgColor = "white";
              let borderColor = "grey.300";
              let icon = getStatusIcon(connector.status);
              let statusText = connector.statusLabel;
              let textColor = "text.primary";

              if (connector.status === "Available") {
                cardBgColor = "success.50";
                borderColor = "success.main";
                statusText = "🟢 Rảnh";
                textColor = "success.main";
              } else if (connector.status === "Charging") {
                cardBgColor = "primary.50";
                borderColor = "primary.main";
                statusText = "🔵 Đang sạc";
                textColor = "primary.main";
              } else if (connector.status === "Faulted" || connector.status === "Unavailable") {
                cardBgColor = "error.50";
                borderColor = "error.main";
                statusText = "🔴 Lỗi/Offline";
                textColor = "error.main";
              }

              return (
                <Grid item xs={12} sm={6} md={3} key={connector.id}>
                  <Card
                    sx={{
                      bgcolor: cardBgColor,
                      border: 2,
                      borderColor: borderColor,
                      height: '100%', // Chiều cao 100% của Grid item
                      minHeight: 180, // Chiều cao tối thiểu cố định
                      display: 'flex',
                      flexDirection: 'column',
                      transition: "all 0.3s",
                      "&:hover": {
                        boxShadow: 4,
                        transform: "translateY(-4px)",
                      },
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                        <Typography variant="h5" fontWeight="bold" color={textColor}>
                          {connector.id}
                        </Typography>
                        <Box sx={{ fontSize: 40 }}>{icon}</Box>
                      </Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {connector.type} - {connector.maxPower} kW
                      </Typography>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="subtitle1" fontWeight={600} color={textColor}>
                        {statusText}
                      </Typography>
                      {connector.currentSession && (
                        <Box mt={1}>
                          <Typography variant="body2" color="text.secondary">
                            Phiên: {connector.currentSession.id}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            SOC: {connector.currentSession.vehicleSOC}%
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default StaffDashboard;
