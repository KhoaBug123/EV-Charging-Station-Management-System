import React, { useState } from "react";
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Avatar,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Paper,
    LinearProgress,
    Chip,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemSecondaryAction,
} from "@mui/material";
import {
    Analytics as AnalyticsIcon,
    TrendingUp,
    Schedule,
    LocationOn,
    ElectricCar,
    AttachMoney,
    Battery80,
    Speed,
    AccessTime,
    Place,
    CalendarMonth,
} from "@mui/icons-material";
import { formatCurrency } from "../../utils/helpers";
// import useBookingStore from "../../store/bookingStore";

const CustomerAnalytics = () => {
    const [timeRange, setTimeRange] = useState("month");
    // const { bookings } = useBookingStore();

    // Mock analytics data - in real app, calculate from bookings
    const analyticsData = {
        month: {
            totalCost: 2450000,
            totalSessions: 15,
            totalEnergyConsumed: 450,
            avgSessionCost: 163333,
            avgEnergyPerSession: 30,
            avgChargingTime: 85, // minutes
            favoriteStations: [
                { name: "Vincom Mega Mall", sessions: 5, percentage: 33 },
                { name: "AEON Mall Bình Tân", sessions: 3, percentage: 20 },
                { name: "Lotte Mart Gò Vấp", sessions: 2, percentage: 13 },
            ],
            chargingHabits: {
                morningHours: 20, // 6-12h
                afternoonHours: 40, // 12-18h
                eveningHours: 40, // 18-24h
            },
            costByWeek: [480000, 620000, 580000, 770000],
            energyByWeek: [88, 115, 107, 140],
        },
        quarter: {
            totalCost: 6750000,
            totalSessions: 42,
            totalEnergyConsumed: 1260,
            avgSessionCost: 160714,
            avgEnergyPerSession: 30,
            avgChargingTime: 82,
            favoriteStations: [
                { name: "Vincom Mega Mall", sessions: 14, percentage: 33 },
                { name: "AEON Mall Bình Tân", sessions: 9, percentage: 21 },
                { name: "Lotte Mart Gò Vấp", sessions: 6, percentage: 14 },
            ],
            chargingHabits: {
                morningHours: 24,
                afternoonHours: 38,
                eveningHours: 38,
            },
        },
        year: {
            totalCost: 24800000,
            totalSessions: 156,
            totalEnergyConsumed: 4680,
            avgSessionCost: 158974,
            avgEnergyPerSession: 30,
            avgChargingTime: 78,
            favoriteStations: [
                { name: "Vincom Mega Mall", sessions: 52, percentage: 33 },
                { name: "AEON Mall Bình Tân", sessions: 34, percentage: 22 },
                { name: "Lotte Mart Gò Vấp", sessions: 23, percentage: 15 },
            ],
            chargingHabits: {
                morningHours: 28,
                afternoonHours: 36,
                eveningHours: 36,
            },
        },
    };

    const currentData = analyticsData[timeRange];

    const getTimeRangeText = () => {
        switch (timeRange) {
            case "month":
                return "Tháng này";
            case "quarter":
                return "Quý này";
            case "year":
                return "Năm này";
            default:
                return "Tháng này";
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
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
                        <AnalyticsIcon />
                    </Avatar>
                    <Box>
                        <Typography variant="h4" fontWeight="bold">
                            Phân tích cá nhân
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Thống kê chi phí và thói quen sạc xe của bạn
                        </Typography>
                    </Box>
                </Box>
                <FormControl sx={{ minWidth: 150 }}>
                    <InputLabel>Thời gian</InputLabel>
                    <Select
                        value={timeRange}
                        label="Thời gian"
                        onChange={(e) => setTimeRange(e.target.value)}
                    >
                        <MenuItem value="month">Tháng này</MenuItem>
                        <MenuItem value="quarter">Quý này</MenuItem>
                        <MenuItem value="year">Năm này</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {/* Key Metrics */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card
                        sx={{
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            color: "white",
                        }}
                    >
                        <CardContent>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)" }}>
                                    <AttachMoney />
                                </Avatar>
                                <Box>
                                    <Typography variant="h4" fontWeight="bold">
                                        {formatCurrency(currentData.totalCost)}
                                    </Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                        Tổng chi phí
                                    </Typography>
                                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                        {getTimeRangeText()}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card
                        sx={{
                            background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
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
                                        {currentData.totalSessions}
                                    </Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                        Phiên sạc
                                    </Typography>
                                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                        Trung bình {formatCurrency(currentData.avgSessionCost)}/phiên
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card
                        sx={{
                            background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                            color: "white",
                        }}
                    >
                        <CardContent>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)" }}>
                                    <Battery80 />
                                </Avatar>
                                <Box>
                                    <Typography variant="h4" fontWeight="bold">
                                        {currentData.totalEnergyConsumed}
                                    </Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                        kWh tiêu thụ
                                    </Typography>
                                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                        TB {currentData.avgEnergyPerSession} kWh/phiên
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card
                        sx={{
                            background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
                            color: "white",
                        }}
                    >
                        <CardContent>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)" }}>
                                    <AccessTime />
                                </Avatar>
                                <Box>
                                    <Typography variant="h4" fontWeight="bold">
                                        {Math.floor(currentData.avgChargingTime / 60)}h{" "}
                                        {currentData.avgChargingTime % 60}m
                                    </Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                        Thời gian TB
                                    </Typography>
                                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                        Mỗi phiên sạc
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Detailed Analytics */}
            <Grid container spacing={3}>
                {/* Cost Trends */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                <TrendingUp sx={{ mr: 1, verticalAlign: "middle" }} />
                                Xu hướng chi phí
                            </Typography>
                            {timeRange === "month" && currentData.costByWeek && (
                                <Box>
                                    {currentData.costByWeek.map((cost, index) => (
                                        <Box key={index} sx={{ mb: 2 }}>
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    mb: 1,
                                                }}
                                            >
                                                <Typography variant="body2">Tuần {index + 1}</Typography>
                                                <Typography variant="body2" fontWeight="medium">
                                                    {formatCurrency(cost)}
                                                </Typography>
                                            </Box>
                                            <LinearProgress
                                                variant="determinate"
                                                value={(cost / Math.max(...currentData.costByWeek)) * 100}
                                                sx={{ height: 6, borderRadius: 3 }}
                                            />
                                        </Box>
                                    ))}
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Favorite Stations */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                <Place sx={{ mr: 1, verticalAlign: "middle" }} />
                                Trạm sạc yêu thích
                            </Typography>
                            <List dense>
                                {currentData.favoriteStations.map((station, index) => (
                                    <ListItem key={index} sx={{ px: 0 }}>
                                        <ListItemIcon>
                                            <Avatar
                                                sx={{
                                                    bgcolor: index === 0 ? "gold" : index === 1 ? "silver" : "bronze",
                                                    width: 32,
                                                    height: 32,
                                                    fontSize: "0.9rem",
                                                }}
                                            >
                                                {index + 1}
                                            </Avatar>
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={station.name}
                                            secondary={`${station.sessions} lần sạc`}
                                        />
                                        <ListItemSecondaryAction>
                                            <Chip
                                                label={`${station.percentage}%`}
                                                size="small"
                                                color="primary"
                                                variant="outlined"
                                            />
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Charging Habits */}
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                <Schedule sx={{ mr: 1, verticalAlign: "middle" }} />
                                Thói quen sạc theo giờ
                            </Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={4}>
                                    <Paper
                                        sx={{
                                            p: 3,
                                            textAlign: "center",
                                            border: "1px solid",
                                            borderColor: "divider",
                                        }}
                                    >
                                        <Typography variant="h3" fontWeight="bold" color="warning.main">
                                            {currentData.chargingHabits.morningHours}%
                                        </Typography>
                                        <Typography variant="body1" fontWeight="medium">
                                            Buổi sáng
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            6:00 - 12:00
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Paper
                                        sx={{
                                            p: 3,
                                            textAlign: "center",
                                            border: "1px solid",
                                            borderColor: "divider",
                                        }}
                                    >
                                        <Typography variant="h3" fontWeight="bold" color="info.main">
                                            {currentData.chargingHabits.afternoonHours}%
                                        </Typography>
                                        <Typography variant="body1" fontWeight="medium">
                                            Buổi chiều
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            12:00 - 18:00
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Paper
                                        sx={{
                                            p: 3,
                                            textAlign: "center",
                                            border: "1px solid",
                                            borderColor: "divider",
                                        }}
                                    >
                                        <Typography variant="h3" fontWeight="bold" color="success.main">
                                            {currentData.chargingHabits.eveningHours}%
                                        </Typography>
                                        <Typography variant="body1" fontWeight="medium">
                                            Buổi tối
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            18:00 - 24:00
                                        </Typography>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default CustomerAnalytics;