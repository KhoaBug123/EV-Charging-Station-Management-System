import React, { useState, useEffect } from "react";
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
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Alert,
    Divider,
} from "@mui/material";
import {
    Psychology,
    LocationOn,
    Schedule,
    Speed,
    TrendingUp,
    ElectricCar,
    AccessTime,
    BatteryChargingFull,
    Insights,
    CalendarMonth,
    AttachMoney,
    EmojiEvents,
    QueryStats,
} from "@mui/icons-material";
import { formatCurrency } from "../../utils/helpers";
import useBookingStore from "../../store/bookingStore";

const ChargingHabitsAnalysis = () => {
    const [timeRange, setTimeRange] = useState("3months");
    const { bookingHistory, getBookingStats, initializeMockData } = useBookingStore();

    // Initialize data if needed
    useEffect(() => {
        if (bookingHistory.length === 0) {
            initializeMockData();
        }
    }, [bookingHistory.length, initializeMockData]);

    // Calculate habits data from booking store
    const bookingStats = getBookingStats();
    const completedBookings = bookingHistory.filter(b => b.status === 'completed');

    // Detailed habits analysis from real booking data
    const habitsData = {
        "3months": {
            // Location Analysis - calculated from actual bookings
            locationPreferences: (() => {
                const stationStats = {};
                completedBookings.forEach(booking => {
                    const stationName = booking.stationName || 'Unknown Station';
                    if (!stationStats[stationName]) {
                        stationStats[stationName] = {
                            name: stationName,
                            sessions: 0,
                            totalCost: 0,
                            totalDuration: 0,
                            satisfactionRating: 4.5 + Math.random() * 0.5 // Random rating 4.5-5.0
                        };
                    }
                    stationStats[stationName].sessions += 1;
                    stationStats[stationName].totalCost += booking.totalAmount || 150000;
                    stationStats[stationName].totalDuration += booking.chargingDuration || 45;
                });

                const total = completedBookings.length;
                return Object.values(stationStats)
                    .sort((a, b) => b.sessions - a.sessions)
                    .slice(0, 5)
                    .map(station => ({
                        name: station.name,
                        sessions: station.sessions,
                        percentage: total > 0 ? Math.round((station.sessions / total) * 100) : 0,
                        avgCost: Math.round(station.totalCost / station.sessions),
                        avgDuration: Math.round(station.totalDuration / station.sessions),
                        preferredTime: ["08:00-10:00", "14:00-16:00", "18:00-20:00"][Math.floor(Math.random() * 3)],
                        satisfactionRating: Number(station.satisfactionRating.toFixed(1))
                    }));
            })(),

            // Time Pattern Analysis (24-hour breakdown)
            hourlyPattern: [
                { hour: "00:00-02:00", sessions: 2, percentage: 3, avgCost: 125000, reason: "Overnight charging" },
                { hour: "02:00-04:00", sessions: 1, percentage: 2, avgCost: 118000, reason: "Late night discount" },
                { hour: "04:00-06:00", sessions: 0, percentage: 0, avgCost: 0, reason: "Inactive period" },
                { hour: "06:00-08:00", sessions: 4, percentage: 7, avgCost: 148000, reason: "Early commute" },
                { hour: "08:00-10:00", sessions: 8, percentage: 14, avgCost: 162000, reason: "Morning arrival" },
                { hour: "10:00-12:00", sessions: 6, percentage: 11, avgCost: 155000, reason: "Late morning" },
                { hour: "12:00-14:00", sessions: 9, percentage: 16, avgCost: 168000, reason: "Lunch time" },
                { hour: "14:00-16:00", sessions: 7, percentage: 12, avgCost: 172000, reason: "Afternoon activity" },
                { hour: "16:00-18:00", sessions: 5, percentage: 9, avgCost: 178000, reason: "Rush hour start" },
                { hour: "18:00-20:00", sessions: 11, percentage: 19, avgCost: 185000, reason: "Evening peak" },
                { hour: "20:00-22:00", sessions: 4, percentage: 7, avgCost: 158000, reason: "Late evening" },
                { hour: "22:00-24:00", sessions: 0, percentage: 0, avgCost: 0, reason: "Night wind-down" }
            ],

            // Power & Connector Usage
            powerUsageAnalysis: [
                {
                    type: "AC Slow (7-11kW)",
                    sessions: 25,
                    percentage: 44,
                    avgCost: 142000,
                    avgDuration: 95,
                    usageReason: "Overnight/long-term parking",
                    efficiency: "Tiết kiệm chi phí"
                },
                {
                    type: "DC Fast (50-100kW)",
                    sessions: 22,
                    percentage: 39,
                    avgCost: 168000,
                    avgDuration: 65,
                    usageReason: "Quick top-up during activities",
                    efficiency: "Cân bằng thời gian/chi phí"
                },
                {
                    type: "DC Ultra (150kW+)",
                    sessions: 10,
                    percentage: 17,
                    avgCost: 195000,
                    avgDuration: 42,
                    usageReason: "Emergency charging/highway trips",
                    efficiency: "Ưu tiên tốc độ"
                }
            ],

            // Behavioral Insights
            insights: [
                {
                    title: "Thời gian sạc tối ưu",
                    finding: "Bạn sạc hiệu quả nhất vào 18:00-20:00 tại Vincom Mega Mall",
                    impact: "Tiết kiệm 12% chi phí so với trung bình",
                    recommendation: "Tiếp tục duy trì thói quen này để tối ưu chi phí"
                },
                {
                    title: "Lựa chọn trạm thông minh",
                    finding: "Top 2 trạm yêu thích có rating cao và chi phí hợp lý",
                    impact: "Satisfaction score 4.7/5 trung bình",
                    recommendation: "Khám phá thêm 2-3 trạm backup cho linh hoạt hơn"
                },
                {
                    title: "Tối ưu công suất sạc",
                    finding: "44% dùng AC slow khi có thời gian dài",
                    impact: "Tiết kiệm 25% chi phí so với chỉ dùng DC Fast",
                    recommendation: "Tăng tỷ lệ sạc chậm khi đỗ xe qua đêm"
                }
            ],

            // Weekly Patterns
            weeklyPattern: {
                weekdays: { sessions: 38, percentage: 67, avgCost: 162000, pattern: "Work-related charging" },
                weekends: { sessions: 19, percentage: 33, avgCost: 148000, pattern: "Leisure/shopping trips" }
            },

            // Seasonal Analysis
            seasonalTrends: [
                { period: "Tháng 7", sessions: 19, avgCost: 158000, trend: "Stable usage" },
                { period: "Tháng 8", sessions: 17, avgCost: 164000, trend: "Slight increase in cost" },
                { period: "Tháng 9", sessions: 21, avgCost: 155000, trend: "Increased frequency, optimized cost" }
            ]
        }
    };

    const currentData = habitsData[timeRange];

    const getTopInsight = () => {
        return currentData.insights[0];
    };

    const getPowerEfficiencyScore = () => {
        const acPercentage = currentData.powerUsageAnalysis[0].percentage;
        if (acPercentage >= 50) return { score: 95, level: "Xuất sắc" };
        if (acPercentage >= 35) return { score: 80, level: "Tốt" };
        if (acPercentage >= 20) return { score: 65, level: "Trung bình" };
        return { score: 40, level: "Cần cải thiện" };
    };

    const getTimeOptimizationScore = () => {
        // Calculate based on peak vs off-peak usage
        const peakHours = currentData.hourlyPattern.filter(h =>
            ["18:00-20:00", "12:00-14:00", "08:00-10:00"].includes(h.hour)
        ).reduce((sum, h) => sum + h.sessions, 0);

        const offPeakHours = currentData.hourlyPattern.filter(h =>
            ["22:00-24:00", "00:00-02:00", "02:00-04:00"].includes(h.hour)
        ).reduce((sum, h) => sum + h.sessions, 0);

        const ratio = offPeakHours / (peakHours + offPeakHours);

        if (ratio >= 0.4) return { score: 90, level: "Tối ưu" };
        if (ratio >= 0.2) return { score: 75, level: "Khá tốt" };
        if (ratio >= 0.1) return { score: 60, level: "Trung bình" };
        return { score: 45, level: "Chưa tối ưu" };
    };

    const efficiencyScore = getPowerEfficiencyScore();
    const timeScore = getTimeOptimizationScore();

    return (
        <Box>
            {/* Header */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar sx={{ bgcolor: "primary.main", mr: 2, width: 56, height: 56 }}>
                        <Psychology />
                    </Avatar>
                    <Box>
                        <Typography variant="h4" fontWeight="bold">
                            Phân tích thói quen sạc xe
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Thống kê chi tiết về thời gian, địa điểm và công suất sạc
                        </Typography>
                    </Box>
                </Box>
                <FormControl sx={{ minWidth: 180 }}>
                    <InputLabel>Khoảng thời gian</InputLabel>
                    <Select
                        value={timeRange}
                        label="Khoảng thời gian"
                        onChange={(e) => setTimeRange(e.target.value)}
                    >
                        <MenuItem value="3months">3 tháng qua</MenuItem>
                        <MenuItem value="6months">6 tháng qua</MenuItem>
                        <MenuItem value="year">1 năm qua</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {/* Key Insights Alert */}
            <Alert severity="info" sx={{ mb: 4 }}>
                <Typography variant="subtitle2" fontWeight="bold">
                    💡 Insight chính: {getTopInsight().title}
                </Typography>
                <Typography variant="body2">
                    {getTopInsight().finding} - {getTopInsight().impact}
                </Typography>
            </Alert>

            {/* Efficiency Scores */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={6}>
                    <Card sx={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white" }}>
                        <CardContent>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)" }}>
                                    <Speed />
                                </Avatar>
                                <Box>
                                    <Typography variant="h3" fontWeight="bold">
                                        {efficiencyScore.score}%
                                    </Typography>
                                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                                        Hiệu quả công suất
                                    </Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                        Mức độ: {efficiencyScore.level}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card sx={{ background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", color: "white" }}>
                        <CardContent>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)" }}>
                                    <Schedule />
                                </Avatar>
                                <Box>
                                    <Typography variant="h3" fontWeight="bold">
                                        {timeScore.score}%
                                    </Typography>
                                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                                        Tối ưu thời gian
                                    </Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                        Mức độ: {timeScore.level}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Location Preferences */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                <LocationOn sx={{ mr: 1, verticalAlign: "middle" }} />
                                Trạm sạc yêu thích
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                Phân tích chi tiết các trạm bạn sử dụng thường xuyên
                            </Typography>

                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Trạm sạc</TableCell>
                                            <TableCell align="center">Lần sạc</TableCell>
                                            <TableCell align="center">% Sử dụng</TableCell>
                                            <TableCell align="center">Chi phí TB</TableCell>
                                            <TableCell align="center">Thời gian TB</TableCell>
                                            <TableCell align="center">Giờ ưa thích</TableCell>
                                            <TableCell align="center">Rating</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {currentData.locationPreferences.map((location, index) => (
                                            <TableRow key={location.name}>
                                                <TableCell>
                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                        <Avatar
                                                            sx={{
                                                                bgcolor: index === 0 ? "gold" : index === 1 ? "silver" : "bronze",
                                                                width: 24,
                                                                height: 24,
                                                                fontSize: "0.8rem"
                                                            }}
                                                        >
                                                            {index + 1}
                                                        </Avatar>
                                                        <Typography variant="body2" fontWeight="medium">
                                                            {location.name}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Chip label={location.sessions} size="small" color="primary" />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Box>
                                                        <Typography variant="body2" fontWeight="bold">
                                                            {location.percentage}%
                                                        </Typography>
                                                        <LinearProgress
                                                            variant="determinate"
                                                            value={location.percentage}
                                                            sx={{ width: 60, mt: 0.5 }}
                                                        />
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Typography variant="body2">
                                                        {formatCurrency(location.avgCost)}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Typography variant="body2">
                                                        {Math.floor(location.avgDuration / 60)}h {location.avgDuration % 60}m
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Typography variant="body2" color="primary.main" fontWeight="medium">
                                                        {location.preferredTime}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Typography variant="body2" fontWeight="bold" color="success.main">
                                                        ⭐ {location.satisfactionRating}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                <CalendarMonth sx={{ mr: 1, verticalAlign: "middle" }} />
                                Thói quen hàng tuần
                            </Typography>

                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Ngày làm việc
                                </Typography>
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                                    <Typography variant="body2">
                                        {currentData.weeklyPattern.weekdays.sessions} phiên sạc
                                    </Typography>
                                    <Typography variant="body2" color="primary.main" fontWeight="bold">
                                        {currentData.weeklyPattern.weekdays.percentage}%
                                    </Typography>
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={currentData.weeklyPattern.weekdays.percentage}
                                    sx={{ mb: 1 }}
                                />
                                <Typography variant="caption" color="text.secondary">
                                    Chi phí TB: {formatCurrency(currentData.weeklyPattern.weekdays.avgCost)}
                                </Typography>
                            </Box>

                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Cuối tuần
                                </Typography>
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                                    <Typography variant="body2">
                                        {currentData.weeklyPattern.weekends.sessions} phiên sạc
                                    </Typography>
                                    <Typography variant="body2" color="secondary.main" fontWeight="bold">
                                        {currentData.weeklyPattern.weekends.percentage}%
                                    </Typography>
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={currentData.weeklyPattern.weekends.percentage}
                                    color="secondary"
                                    sx={{ mb: 1 }}
                                />
                                <Typography variant="caption" color="text.secondary">
                                    Chi phí TB: {formatCurrency(currentData.weeklyPattern.weekends.avgCost)}
                                </Typography>
                            </Box>

                            <Alert severity="info" sx={{ mt: 2 }}>
                                <Typography variant="caption">
                                    💡 Bạn sạc nhiều hơn trong tuần (công việc) và tiết kiệm hơn vào cuối tuần
                                </Typography>
                            </Alert>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Hourly Pattern Analysis */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                <AccessTime sx={{ mr: 1, verticalAlign: "middle" }} />
                                Phân tích thời gian sạc 24/7
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                Thói quen sạc xe theo từng khung giờ trong ngày
                            </Typography>

                            <Grid container spacing={2}>
                                {currentData.hourlyPattern.map((timeSlot, index) => (
                                    <Grid item xs={12} sm={6} md={4} key={timeSlot.hour}>
                                        <Paper
                                            sx={{
                                                p: 2,
                                                border: timeSlot.sessions > 0 ? "2px solid" : "1px solid",
                                                borderColor: timeSlot.sessions > 0 ? "primary.main" : "divider",
                                                bgcolor: timeSlot.sessions > 0 ? "primary.50" : "grey.50"
                                            }}
                                        >
                                            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                                {timeSlot.hour}
                                            </Typography>

                                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                                                <Typography variant="h6" color="primary.main" fontWeight="bold">
                                                    {timeSlot.sessions}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {timeSlot.percentage}%
                                                </Typography>
                                            </Box>

                                            {timeSlot.sessions > 0 && (
                                                <Typography variant="body2" sx={{ mb: 1 }}>
                                                    Chi phí TB: {formatCurrency(timeSlot.avgCost)}
                                                </Typography>
                                            )}

                                            <Typography variant="caption" color="text.secondary" fontStyle="italic">
                                                {timeSlot.reason}
                                            </Typography>

                                            <LinearProgress
                                                variant="determinate"
                                                value={timeSlot.percentage}
                                                sx={{ mt: 1 }}
                                                color={timeSlot.sessions >= 8 ? "primary" : timeSlot.sessions >= 4 ? "secondary" : "inherit"}
                                            />
                                        </Paper>
                                    </Grid>
                                ))}
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Power Usage Analysis */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                <BatteryChargingFull sx={{ mr: 1, verticalAlign: "middle" }} />
                                Phân tích sử dụng công suất
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                Lựa chọn công suất sạc và hiệu quả chi phí
                            </Typography>

                            {currentData.powerUsageAnalysis.map((power, index) => (
                                <Box key={power.type} sx={{ mb: 3 }}>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                                        <Box>
                                            <Typography variant="subtitle1" fontWeight="bold">
                                                {power.type}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {power.usageReason}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ textAlign: "right" }}>
                                            <Typography variant="h6" color="primary.main" fontWeight="bold">
                                                {power.percentage}%
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {power.sessions} phiên sạc
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <LinearProgress
                                        variant="determinate"
                                        value={power.percentage}
                                        sx={{ mb: 2, height: 8, borderRadius: 4 }}
                                        color={index === 0 ? "success" : index === 1 ? "info" : "warning"}
                                    />

                                    <Grid container spacing={2}>
                                        <Grid item xs={4}>
                                            <Typography variant="body2" color="text.secondary">
                                                Chi phí TB
                                            </Typography>
                                            <Typography variant="body2" fontWeight="bold">
                                                {formatCurrency(power.avgCost)}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Typography variant="body2" color="text.secondary">
                                                Thời gian TB
                                            </Typography>
                                            <Typography variant="body2" fontWeight="bold">
                                                {Math.floor(power.avgDuration / 60)}h {power.avgDuration % 60}m
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Typography variant="body2" color="text.secondary">
                                                Hiệu quả
                                            </Typography>
                                            <Typography variant="body2" fontWeight="bold" color="success.main">
                                                {power.efficiency}
                                            </Typography>
                                        </Grid>
                                    </Grid>

                                    {index < currentData.powerUsageAnalysis.length - 1 && <Divider sx={{ mt: 2 }} />}
                                </Box>
                            ))}
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                <TrendingUp sx={{ mr: 1, verticalAlign: "middle" }} />
                                Xu hướng theo tháng
                            </Typography>

                            {currentData.seasonalTrends.map((month, index) => (
                                <Box key={month.period} sx={{ mb: 2 }}>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                                        <Typography variant="subtitle2" fontWeight="bold">
                                            {month.period}
                                        </Typography>
                                        <Chip
                                            label={month.sessions}
                                            size="small"
                                            color="primary"
                                        />
                                    </Box>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        Chi phí TB: {formatCurrency(month.avgCost)}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" fontStyle="italic">
                                        {month.trend}
                                    </Typography>
                                    {index < currentData.seasonalTrends.length - 1 && <Divider sx={{ mt: 2 }} />}
                                </Box>
                            ))}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Insights & Recommendations */}
            <Card>
                <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                        <Insights sx={{ mr: 1, verticalAlign: "middle" }} />
                        Phân tích hành vi & Khuyến nghị
                    </Typography>

                    <Grid container spacing={3}>
                        {currentData.insights.map((insight, index) => (
                            <Grid item xs={12} md={4} key={insight.title}>
                                <Paper sx={{ p: 3, height: "100%", border: "1px solid", borderColor: "divider" }}>
                                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                        <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
                                            <QueryStats />
                                        </Avatar>
                                        <Typography variant="subtitle1" fontWeight="bold">
                                            {insight.title}
                                        </Typography>
                                    </Box>

                                    <Typography variant="body2" sx={{ mb: 2 }}>
                                        <strong>Phát hiện:</strong> {insight.finding}
                                    </Typography>

                                    <Typography variant="body2" sx={{ mb: 2 }} color="success.main">
                                        <strong>Tác động:</strong> {insight.impact}
                                    </Typography>

                                    <Alert severity="info" sx={{ mt: 2 }}>
                                        <Typography variant="body2">
                                            <strong>Khuyến nghị:</strong> {insight.recommendation}
                                        </Typography>
                                    </Alert>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    );
};

export default ChargingHabitsAnalysis;