import React, { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Button,
    Stack,
    Alert,
    Chip,
    ToggleButton,
    ToggleButtonGroup,
    TextField,
    InputAdornment,
    Grid,
    Paper,
    Divider
} from '@mui/material';
import {
    Map as MapIcon,
    ViewList,
    Search,
    FilterList,
    Refresh
} from '@mui/icons-material';
import StationMapGoogle from '../../components/customer/StationMapGoogle';
import StationMapLeaflet from '../../components/customer/StationMapLeaflet';
import useStationStore from '../../store/stationStore';
import BookingModal from '../../components/customer/BookingModal';

const MapComparison = () => {
    const [mapType, setMapType] = useState('google'); // 'google' or 'leaflet'
    const [selectedStation, setSelectedStation] = useState(null);
    const [bookingModalOpen, setBookingModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [userLocation, setUserLocation] = useState(null);

    const { getFilteredStations, initializeData } = useStationStore();

    React.useEffect(() => {
        initializeData();
    }, [initializeData]);

    const stations = getFilteredStations();

    const filteredStations = stations.filter(station =>
        station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        station.location.address.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleGetLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (error) => {
                    console.error('Error getting location:', error);
                }
            );
        }
    };

    const handleStationSelect = (station) => {
        setSelectedStation(station);
    };

    const handleBookingClick = (station) => {
        setSelectedStation(station);
        setBookingModalOpen(true);
    };

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom fontWeight="bold">
                    🗺️ So sánh Google Maps vs Leaflet
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Demo tích hợp Google Maps API với các tính năng nâng cao
                </Typography>
            </Box>

            {/* API Key Warning */}
            {!import.meta.env.VITE_GOOGLE_MAPS_API_KEY && (
                <Alert severity="warning" sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>
                        ⚠️ Google Maps API Key chưa được cấu hình
                    </Typography>
                    <Typography variant="body2">
                        Xem file <code>GOOGLE_MAPS_GUIDE.md</code> để biết cách cấu hình
                    </Typography>
                </Alert>
            )}

            {/* Controls */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Grid container spacing={2} alignItems="center">
                        {/* Map Type Toggle */}
                        <Grid item xs={12} md={4}>
                            <Typography variant="subtitle2" gutterBottom>
                                Loại bản đồ:
                            </Typography>
                            <ToggleButtonGroup
                                value={mapType}
                                exclusive
                                onChange={(e, newType) => newType && setMapType(newType)}
                                fullWidth
                                size="small"
                            >
                                <ToggleButton value="google">
                                    <MapIcon sx={{ mr: 1 }} />
                                    Google Maps
                                </ToggleButton>
                                <ToggleButton value="leaflet">
                                    <ViewList sx={{ mr: 1 }} />
                                    Leaflet
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </Grid>

                        {/* Search */}
                        <Grid item xs={12} md={5}>
                            <Typography variant="subtitle2" gutterBottom>
                                Tìm kiếm trạm:
                            </Typography>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Tìm theo tên hoặc địa chỉ..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search />
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Grid>

                        {/* Actions */}
                        <Grid item xs={12} md={3}>
                            <Typography variant="subtitle2" gutterBottom>
                                Hành động:
                            </Typography>
                            <Stack direction="row" spacing={1}>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={handleGetLocation}
                                    fullWidth
                                >
                                    Vị trí của tôi
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={() => {
                                        setSearchQuery('');
                                        setSelectedStation(null);
                                    }}
                                    fullWidth
                                >
                                    <Refresh />
                                </Button>
                            </Stack>
                        </Grid>
                    </Grid>

                    {/* Stats */}
                    <Divider sx={{ my: 2 }} />
                    <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                        <Chip 
                            label={`${filteredStations.length} trạm sạc`} 
                            color="primary" 
                            size="small" 
                        />
                        {selectedStation && (
                            <Chip 
                                label={`Đã chọn: ${selectedStation.name}`} 
                                color="success" 
                                size="small"
                                onDelete={() => setSelectedStation(null)}
                            />
                        )}
                        {userLocation && (
                            <Chip 
                                label="Đã bật GPS" 
                                color="info" 
                                size="small"
                            />
                        )}
                    </Stack>
                </CardContent>
            </Card>

            {/* Map Display */}
            <Card>
                <CardContent sx={{ p: 0 }}>
                    {mapType === 'google' ? (
                        <StationMapGoogle
                            stations={filteredStations}
                            selectedStation={selectedStation}
                            onStationSelect={handleStationSelect}
                            onBookingClick={handleBookingClick}
                            userLocation={userLocation}
                            height="calc(100vh - 400px)"
                            showControls={true}
                        />
                    ) : (
                        <StationMapLeaflet
                            stations={filteredStations}
                            selectedStation={selectedStation}
                            onStationSelect={handleStationSelect}
                            onBookingClick={handleBookingClick}
                            userLocation={userLocation}
                            height="calc(100vh - 400px)"
                        />
                    )}
                </CardContent>
            </Card>

            {/* Feature Comparison */}
            <Card sx={{ mt: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                        📊 So sánh tính năng
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Paper variant="outlined" sx={{ p: 2 }}>
                                <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom>
                                    ✅ Google Maps
                                </Typography>
                                <ul style={{ margin: 0, paddingLeft: 20 }}>
                                    <li>Dữ liệu địa lý chính xác cao</li>
                                    <li>Tích hợp Places API</li>
                                    <li>Directions API cho chỉ đường</li>
                                    <li>Street View</li>
                                    <li>Tự động cập nhật địa danh</li>
                                    <li>UI/UX quen thuộc với người dùng</li>
                                    <li>Performance tốt với many markers</li>
                                    <li><strong>Custom markers & info windows</strong></li>
                                </ul>
                                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                    ⚠️ Cần API key (miễn phí $200 credit/tháng)
                                </Typography>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Paper variant="outlined" sx={{ p: 2 }}>
                                <Typography variant="subtitle1" fontWeight="bold" color="success.main" gutterBottom>
                                    ✅ Leaflet (OpenStreetMap)
                                </Typography>
                                <ul style={{ margin: 0, paddingLeft: 20 }}>
                                    <li>Hoàn toàn miễn phí</li>
                                    <li>Open source</li>
                                    <li>Nhẹ hơn (bundle size nhỏ)</li>
                                    <li>Không cần API key</li>
                                    <li>Hỗ trợ offline maps</li>
                                    <li>Nhiều tile providers</li>
                                    <li>Custom plugins phong phú</li>
                                    <li>Privacy-friendly</li>
                                </ul>
                                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                    ℹ️ Dữ liệu từ cộng đồng OpenStreetMap
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Booking Modal */}
            <BookingModal
                open={bookingModalOpen}
                onClose={() => {
                    setBookingModalOpen(false);
                    setSelectedStation(null);
                }}
                station={selectedStation}
                onSuccess={() => {
                    setBookingModalOpen(false);
                    // Handle successful booking
                }}
            />
        </Container>
    );
};

export default MapComparison;
