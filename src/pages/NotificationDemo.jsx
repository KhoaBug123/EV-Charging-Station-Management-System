/* eslint-disable */
import React from 'react';
import {
    Container,
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    Grid,
    Divider,
    Alert,
    Paper
} from '@mui/material';
import {
    Notifications,
    CheckCircle,
    Info,
    Warning,
    Error as ErrorIcon,
    Refresh
} from '@mui/icons-material';
import notificationService from '../services/notificationService';

const NotificationDemo = () => {
    const handleRequestPermission = async () => {
        const granted = await notificationService.requestPermission();
        if (granted) {
            alert('✅ Đã cấp quyền thông báo push!');
        } else {
            alert('❌ Người dùng từ chối quyền thông báo');
        }
    };

    const testNotifications = [
        {
            title: 'Đặt chỗ thành công',
            action: () => notificationService.notifyBookingConfirmed({
                stationName: 'Green Mall Charging Hub',
                id: 'BOOK' + Date.now()
            }),
            icon: <CheckCircle color="success" />,
            color: 'success'
        },
        {
            title: 'Bắt đầu sạc xe',
            action: () => notificationService.notifyChargingStarted({
                stationName: 'AEON Mall Bình Tân',
                currentSOC: 35
            }),
            icon: <Info color="info" />,
            color: 'info'
        },
        {
            title: 'Hoàn thành sạc',
            action: () => notificationService.notifyChargingCompleted({
                energyDelivered: 25.5,
                finalSOC: 80
            }),
            icon: <CheckCircle color="success" />,
            color: 'success'
        },
        {
            title: 'Đạt mục tiêu SOC',
            action: () => notificationService.notifySOCTarget({
                targetSOC: 80
            }),
            icon: <CheckCircle color="success" />,
            color: 'success'
        },
        {
            title: 'Thanh toán thành công',
            action: () => notificationService.notifyPaymentSuccess({
                amount: 212500,
                invoiceNumber: 'INV-' + Date.now()
            }),
            icon: <CheckCircle color="success" />,
            color: 'success'
        },
        {
            title: 'Số dư ví thấp',
            action: () => notificationService.notifyLowBalance(50000),
            icon: <Warning color="warning" />,
            color: 'warning'
        },
        {
            title: 'Bảo trì trạm sạc',
            action: () => notificationService.notifyMaintenanceScheduled({
                stationName: 'Lotte Mart Gò Vấp',
                scheduledTime: '15:00 - 17:00, 10/10/2025'
            }),
            icon: <Warning color="warning" />,
            color: 'warning'
        },
        {
            title: 'Ưu đãi mới',
            action: () => notificationService.notifyPromotionAvailable({
                message: 'Giảm 25% cho tất cả phiên sạc cuối tuần này!'
            }),
            icon: <Info color="info" />,
            color: 'info'
        }
    ];

    const handleClearAll = () => {
        notificationService.clearAll();
        alert('Đã xóa tất cả thông báo');
    };

    const handleMarkAllAsRead = () => {
        notificationService.markAllAsRead();
        alert('Đã đánh dấu tất cả là đã đọc');
    };

    const currentStats = {
        total: notificationService.getAll().length,
        unread: notificationService.getUnreadCount(),
        promotionCount: notificationService.getTodayPromotionCount()
    };

    const handleResetPromotions = () => {
        notificationService.resetPromotionCount();
        alert('Đã reset promotion count về 0');
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    🔔 Notification System Demo
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Test hệ thống thông báo push và in-app notifications
                </Typography>
            </Box>

            {/* Stats */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Notifications color="primary" sx={{ fontSize: 40 }} />
                                <Box>
                                    <Typography variant="h4" fontWeight="bold">
                                        {currentStats.total}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Tổng thông báo
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <CheckCircle color="error" sx={{ fontSize: 40 }} />
                                <Box>
                                    <Typography variant="h4" fontWeight="bold" color="error">
                                        {currentStats.unread}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Chưa đọc
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Info color="info" sx={{ fontSize: 40 }} />
                                <Box>
                                    <Typography variant="h4" fontWeight="bold" color="info.main">
                                        {Notification.permission}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Push Permission
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Warning color="warning" sx={{ fontSize: 40 }} />
                                <Box>
                                    <Typography variant="h4" fontWeight="bold" color="warning.main">
                                        {currentStats.promotionCount}/2
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Ưu đãi hôm nay
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2" fontWeight="medium" gutterBottom>
                    📱 Hướng dẫn sử dụng:
                </Typography>
                <Typography variant="body2">
                    1. Click "Cấp quyền thông báo" để bật push notifications<br />
                    2. Nhấn các nút bên dưới để test từng loại thông báo<br />
                    3. Xem thông báo ở góc phải header (biểu tượng chuông)<br />
                    4. Push notifications sẽ hiện cả khi tab bị ẩn
                </Typography>
            </Alert>

            {/* Permission Request */}
            <Paper sx={{ p: 3, mb: 4 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    🔐 Quyền thông báo
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Trạng thái hiện tại: <strong>{Notification.permission}</strong>
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="contained"
                        onClick={handleRequestPermission}
                        disabled={Notification.permission === 'granted'}
                    >
                        Cấp quyền thông báo
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => window.location.reload()}
                        startIcon={<Refresh />}
                    >
                        Refresh
                    </Button>
                </Box>
            </Paper>

            {/* Test Buttons */}
            <Card>
                <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                        🧪 Test Notifications
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Grid container spacing={2}>
                        {testNotifications.map((test, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    onClick={test.action}
                                    startIcon={test.icon}
                                    color={test.color}
                                    sx={{ py: 2, justifyContent: 'flex-start' }}
                                >
                                    {test.title}
                                </Button>
                            </Grid>
                        ))}
                    </Grid>

                    <Divider sx={{ my: 3 }} />

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            variant="outlined"
                            color="warning"
                            onClick={handleMarkAllAsRead}
                            disabled={currentStats.unread === 0}
                        >
                            Đánh dấu tất cả đã đọc
                        </Button>
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={handleClearAll}
                            disabled={currentStats.total === 0}
                        >
                            Xóa tất cả thông báo
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            {/* Features */}
            <Box sx={{ mt: 4 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    ✨ Tính năng đã implement
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                📱 Web Push Notifications
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                • Browser native notifications<br />
                                • Hiện cả khi tab bị ẩn<br />
                                • Click để navigate
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                🔔 In-App Notification Center
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                • Badge count (unread)<br />
                                • Mark as read/unread<br />
                                • Delete individual/all<br />
                                • Time ago display
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                🎯 Auto Notifications
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                • Booking confirmed<br />
                                • Charging started/completed<br />
                                • SOC target reached<br />
                                • Payment success<br />
                                • Low wallet balance
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                💾 Persistence
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                • Keep last 50 notifications<br />
                                • Real-time updates<br />
                                • Event listener system
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default NotificationDemo;
