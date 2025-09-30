import React, { useState } from "react";
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Avatar,
    Button,
    LinearProgress,
    Chip,
    Alert,
    Stack,
    Container,
} from "@mui/material";
import {
    ElectricCar,
    LocationOn,
    Payment,
    QrCodeScanner,
    History,
    AccountBalanceWallet,
    Assessment,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../../utils/helpers";
import useAuthStore from "../../store/authStore";

const CustomerDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();

    // Phiên sạc hiện tại (nếu có)
    const [activeCharging] = useState(null); // Chỉ hiển thị khi đang có phiên sạc

    // Chức năng chính cho tài xế EV
    const quickActions = [
        {
            title: "Tìm trạm sạc",
            description: "Tìm trạm gần nhất",
            icon: <LocationOn />,
            color: "primary",
            path: "/customer/find-stations"
        },
        {
            title: "Quét QR",
            description: "Bắt đầu sạc ngay",
            icon: <QrCodeScanner />,
            color: "success",
            path: "/qr-demo"
        },
        {
            title: "Thanh toán",
            description: "Quản lý ví & thẻ",
            icon: <AccountBalanceWallet />,
            color: "warning",
            path: "/customer/payment"
        },
        {
            title: "Thống kê & Báo cáo Chi phí",
            description: "Phân tích chi phí & thống kê sạc",
            icon: <Assessment />,
            color: "info",
            path: "/customer/analytics"
        }
    ];

    // Thống kê thực tế tháng 9/2024 (dữ liệu đồng bộ)
    const monthlyStats = {
        chargingSessions: 12,
        totalCost: 1680000,
        totalEnergy: 245,
        averageCost: Math.round(1680000 / 245) // = 6857 VNĐ/kWh (tính toán chính xác)
    };



    return (
        <Container maxWidth="lg" sx={{ py: 3 }}>
            {/* Header chào mừng đơn giản */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Chào mừng, {user?.name?.split(' ')[0] || 'Tài xế'}!
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Quản lý việc sạc xe điện của bạn
                </Typography>
            </Box>

            {/* Thông báo phiên sạc (chỉ hiển thị khi đang sạc) */}
            {activeCharging && (
                <Alert severity="success" sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" fontWeight="bold">
                        Đang sạc tại {activeCharging.stationName}
                    </Typography>
                    <Typography variant="body2">
                        Pin: {activeCharging.currentSOC}% • Thời gian còn lại: {activeCharging.timeRemaining} phút
                    </Typography>
                    <LinearProgress
                        variant="determinate"
                        value={activeCharging.progress}
                        sx={{ mt: 1, height: 6, borderRadius: 3 }}
                    />
                </Alert>
            )}

            {/* Các chức năng chính */}
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Chức năng chính
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                {quickActions.map((action, index) => (
                    <Grid item xs={6} md={3} key={index}>
                        <Card
                            sx={{
                                cursor: "pointer",
                                transition: "all 0.2s",
                                "&:hover": {
                                    transform: "translateY(-2px)",
                                    boxShadow: 4
                                }
                            }}
                            onClick={() => navigate(action.path)}
                        >
                            <CardContent sx={{ textAlign: "center", py: 3 }}>
                                <Avatar
                                    sx={{
                                        bgcolor: `${action.color}.main`,
                                        mx: "auto",
                                        mb: 2,
                                        width: 56,
                                        height: 56
                                    }}
                                >
                                    {action.icon}
                                </Avatar>
                                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                    {action.title}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {action.description}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Thống kê tháng này */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Tổng quan tháng này
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={6} sm={3}>
                            <Box sx={{ textAlign: "center" }}>
                                <Typography variant="h4" color="primary.main" fontWeight="bold">
                                    {monthlyStats.chargingSessions}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    lần sạc
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <Box sx={{ textAlign: "center" }}>
                                <Typography variant="h4" color="success.main" fontWeight="bold">
                                    {monthlyStats.totalEnergy}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    kWh
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <Box sx={{ textAlign: "center" }}>
                                <Typography variant="h4" color="warning.main" fontWeight="bold">
                                    {formatCurrency(monthlyStats.totalCost)}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    chi phí
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <Box sx={{ textAlign: "center" }}>
                                <Typography variant="h4" color="info.main" fontWeight="bold">
                                    {formatCurrency(monthlyStats.averageCost)}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    VNĐ/kWh
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Lịch sử sạc gần đây */}
            <Card>
                <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                        <Typography variant="h6" fontWeight="bold">
                            Lịch sử gần đây
                        </Typography>
                        <Button size="small" onClick={() => navigate("/customer/history")}>
                            Xem tất cả
                        </Button>
                    </Box>

                    <Stack spacing={2}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2, border: 1, borderColor: "divider", borderRadius: 2 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <Avatar sx={{ bgcolor: "primary.light" }}>
                                    <ElectricCar />
                                </Avatar>
                                <Box>
                                    <Typography variant="subtitle2" fontWeight="medium">
                                        Vincom Landmark 81
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        28/09/2024 • 22.5 kWh • 45 phút
                                    </Typography>
                                </Box>
                            </Box>
                            <Box sx={{ textAlign: "right" }}>
                                <Typography variant="subtitle2" fontWeight="bold">
                                    {formatCurrency(154350)}
                                </Typography>
                                <Chip label="Hoàn thành" size="small" color="success" />
                            </Box>
                        </Box>

                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2, border: 1, borderColor: "divider", borderRadius: 2 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <Avatar sx={{ bgcolor: "primary.light" }}>
                                    <ElectricCar />
                                </Avatar>
                                <Box>
                                    <Typography variant="subtitle2" fontWeight="medium">
                                        AEON Mall Tân Phú
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        26/09/2024 • 18.2 kWh • 38 phút
                                    </Typography>
                                </Box>
                            </Box>
                            <Box sx={{ textAlign: "right" }}>
                                <Typography variant="subtitle2" fontWeight="bold">
                                    {formatCurrency(124794)}
                                </Typography>
                                <Chip label="Hoàn thành" size="small" color="success" />
                            </Box>
                        </Box>

                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2, border: 1, borderColor: "divider", borderRadius: 2 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <Avatar sx={{ bgcolor: "primary.light" }}>
                                    <ElectricCar />
                                </Avatar>
                                <Box>
                                    <Typography variant="subtitle2" fontWeight="medium">
                                        Saigon Centre Q1
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        24/09/2024 • 31.8 kWh • 68 phút
                                    </Typography>
                                </Box>
                            </Box>
                            <Box sx={{ textAlign: "right" }}>
                                <Typography variant="subtitle2" fontWeight="bold">
                                    {formatCurrency(218046)}
                                </Typography>
                                <Chip label="Hoàn thành" size="small" color="success" />
                            </Box>
                        </Box>
                    </Stack>
                </CardContent>
            </Card>
        </Container>
    );
};

export default CustomerDashboard;