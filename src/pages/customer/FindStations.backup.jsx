import React, { useState, useEffect } from "react";
import useVehicleStore from "../../store/vehicleStore";
import useBookingStore from "../../store/bookingStore";ct, { useState, useEffect } from "react";
import useVehicleStore from "../../store/vehicleStore";
import useBookingSt    console.log("\n\ud83d\udccb All available stations:");
    availableStations.forEach((station, i) => {
      console.log(`   ${i+1}. ${station.name} (${station.status})`);
    });

    try {
      // Start with all active stations
      let result = availableStations.filter(station => { "../../store/bookingStore";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Rating,
  Avatar,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Search,
  LocationOn,
  ElectricCar,
  Speed,
  FilterList,
  Star,
  Navigation,
} from "@mui/icons-material";
import useStationStore from "../../store/stationStore";
import {
  formatCurrency,
  calculateDistance,
} from "../../utils/helpers";
import { getStationImage } from "../../utils/imageAssets";
import { CONNECTOR_TYPES } from "../../utils/constants";
import BookingModal from "../../components/customer/BookingModal";
import { getText, formatText } from "../../utils/vietnameseTexts";

const FindStations = () => {
  const {
    stations,
    filters,
    updateFilters,
    fetchNearbyStations,
    initializeData,
    loading,
  } = useStationStore();

  // Import mock data directly to ensure we have data
  const { mockStations } = React.useMemo(() => {
    // Use dynamic import or fallback data
    const fallbackStations = [
      {
        id: "station-001",
        name: "Green Mall Charging Hub",
        status: "active",
        location: {
          address: "123 Đường Nguyễn Huệ, Quận 1, Thành phố Hồ Chí Minh",
          coordinates: { lat: 10.7769, lng: 106.7009 }
        },
        charging: {
          connectorTypes: ["Type 2", "CCS2", "CHAdeMO"]
        }
      },
      {
        id: "station-002", 
        name: "Tech Park EV Station",
        status: "active",
        location: {
          address: "456 Lê Lợi, Quận 1, Thành phố Hồ Chí Minh",
          coordinates: { lat: 10.7748, lng: 106.7019 }
        },
        charging: {
          connectorTypes: ["CCS2", "CHAdeMO"]
        }
      }
    ];
    
    console.log("📦 Using fallback mockStations:", fallbackStations.length);
    return { mockStations: fallbackStations };
  }, []);

  console.log("🏪 FindStations render - stations:", stations?.length, "loading:", loading);
  console.log("📊 Mock data available:", mockStations?.length);
  console.log("📊 First few stations:", stations?.slice(0, 3)?.map(s => ({ id: s.id, name: s.name, status: s.status })));

  const {
    getCurrentVehicleConnectors
  } = useVehicleStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] = useState({
    lat: 10.7769,
    lng: 106.7009,
  }); // Default to Ho Chi Minh City
  const [selectedStation, setSelectedStation] = useState(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [stationToBook, setStationToBook] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingMessage, setBookingMessage] = useState("");

  // Real-time search with independent filtering
  const filteredStations = React.useMemo(() => {
    console.log("\n🔄 === FILTERING START ===");
    console.log("📊 Raw data check:");
    console.log("   - Stations available:", stations?.length || 0);
    console.log("   - Search query:", `"${searchQuery}"`); 
    console.log("   - Connector filters:", filters.connectorTypes);
    console.log("   - Loading state:", loading);

    // Use mockStations if store is empty
    let availableStations = stations;
    if (!stations || stations.length === 0) {
      console.log("⚠️ Store empty, using mockStations");
      availableStations = mockStations;
    }
    
    if (!availableStations || availableStations.length === 0) {
      console.log("❌ No stations data available at all");
      return [];
    }

    console.log("📋 All available stations:");
    stations.forEach((station, i) => {
      console.log(`   ${i+1}. ${station.name} (${station.status})`);
    });

    try {
      // Start with all active stations
      let result = stations.filter(station => {
        const isActive = station.status === 'active';
        if (!isActive) {
          console.log(`   ❌ ${station.name} - not active (${station.status})`);
        }
        return isActive;
      });
      
      console.log("\n✅ Active stations:", result.map(s => s.name));

      // Apply search filter if query exists
      if (searchQuery && searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        console.log(`\n🔍 Searching for: "${query}"`);
        
        result = result.filter(station => {
          const name = station.name?.toLowerCase() || '';
          const address = station.location?.address?.toLowerCase() || '';
          const city = station.location?.city?.toLowerCase() || '';
          const district = station.location?.district?.toLowerCase() || '';
          
          const nameMatch = name.includes(query);
          const addressMatch = address.includes(query);
          const cityMatch = city.includes(query);
          const districtMatch = district.includes(query);
          
          const matches = nameMatch || addressMatch || cityMatch || districtMatch;
          
          console.log(`   🏪 ${station.name}:`);
          console.log(`      - Name match ("${name}" contains "${query}"): ${nameMatch}`);
          console.log(`      - Address match: ${addressMatch}`);
          console.log(`      - Overall match: ${matches ? '✅' : '❌'}`);
          
          return matches;
        });
        
        console.log(`\n🔍 Search results: ${result.length} stations`);
        result.forEach(s => console.log(`      ✅ ${s.name}`));
      }

      // Apply connector type filter if selected
      if (filters.connectorTypes && filters.connectorTypes.length > 0) {
        console.log(`\n🔌 Filtering by connectors: ${filters.connectorTypes.join(', ')}`);
        
        result = result.filter(station => {
          const stationConnectors = station.charging?.connectorTypes || [];
          const hasMatch = filters.connectorTypes.some(filterType =>
            stationConnectors.includes(filterType)
          );
          
          console.log(`   🏪 ${station.name}:`);
          console.log(`      - Has connectors: [${stationConnectors.join(', ')}]`);
          console.log(`      - Matches filter: ${hasMatch ? '✅' : '❌'}`);
          
          return hasMatch;
        });
      }

      // Apply distance filter if available
      if (filters.maxDistance && userLocation) {
        console.log(`\n📍 Filtering by distance: ≤${filters.maxDistance}km`);
        
        result = result.filter(station => {
          const distance = calculateDistance(
            userLocation.lat,
            userLocation.lng,
            station.location.coordinates.lat,
            station.location.coordinates.lng
          );
          const withinRange = distance <= filters.maxDistance;
          
          console.log(`   🏪 ${station.name}: ${distance.toFixed(2)}km ${withinRange ? '✅' : '❌'}`);
          
          return withinRange;
        });
      }

      console.log(`\n🎯 === FINAL RESULTS: ${result.length} stations ===`);
      result.forEach((s, i) => console.log(`   ${i+1}. ${s.name}`));
      console.log("=== FILTERING END ===\n");
      
      return result;
      
    } catch (error) {
      console.error("❌ Filtering error:", error);
      return [];
    }
  }, [stations, searchQuery, filters, userLocation, loading, mockStations]);

  useEffect(() => {
    console.log("🚀 FindStations component mounted, initializing data...");
    // Initialize data first
    initializeData();
  }, [initializeData]);

  const initializeLocation = React.useCallback(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(newLocation);
          fetchNearbyStations(newLocation, filters.maxDistance);
        },
        () => {
          console.warn("Location access denied, using default location");
          const defaultLocation = {
            lat: 10.7769,
            lng: 106.7009,
          };
          setUserLocation(defaultLocation);
          fetchNearbyStations(defaultLocation, filters.maxDistance);
        }
      );
    } else {
      // Fallback: load stations with default location
      const defaultLocation = {
        lat: 10.7769,
        lng: 106.7009,
      };
      setUserLocation(defaultLocation);
      fetchNearbyStations(defaultLocation, filters.maxDistance);
    }
  }, [fetchNearbyStations, filters.maxDistance]);

  useEffect(() => {
    initializeLocation();
  }, [initializeLocation]);



  const handleBookStation = (station) => {
    setStationToBook(station);
    setBookingModalOpen(true);
  };

  const handleBookingModalClose = () => {
    setBookingModalOpen(false);
    setStationToBook(null);

    // Check if there's a new booking to show success message
    const { bookings } = useBookingStore.getState();
    const latestBooking = bookings[bookings.length - 1];
    if (latestBooking && new Date(latestBooking.createdAt) > new Date(Date.now() - 5000)) {
      setBookingMessage(
        formatText("stations.bookingSuccess", {
          stationName: latestBooking.stationName,
          bookingId: latestBooking.id
        })
      );
      setBookingSuccess(true);
    }
  };



  const getDistanceToStation = (station) => {
    return calculateDistance(
      userLocation.lat,
      userLocation.lng,
      station.location.coordinates.lat,
      station.location.coordinates.lng
    );
  };

  const getStatusChip = (station) => {
    const availablePorts = station.charging.availablePorts;
    const totalPorts = station.charging.totalPorts;

    if (station.status !== "active") {
      return <Chip label={getText("stations.offline")} color="error" size="small" />;
    }

    if (availablePorts === 0) {
      return <Chip label={getText("stations.full")} color="warning" size="small" />;
    }

    if (availablePorts === totalPorts) {
      return <Chip label={getText("stations.available")} color="success" size="small" />;
    }

    return (
      <Chip
        label={`${availablePorts}/${totalPorts} Có sẵn`}
        color="info"
        size="small"
      />
    );
  };

  return (
    <Box>
      {/* Header */}
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        {getText("stations.title")} ⚡
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        {getText("stations.subtitle")}
      </Typography>

      {/* Search & Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            {/* Search Bar */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Nhập tên trạm để tìm kiếm ngay lập tức..."
                value={searchQuery}
                onChange={(e) => {
                  const value = e.target.value;
                  console.log(`🔤 User typed: "${value}"`);
                  setSearchQuery(value);
                }}
                InputProps={{
                  startAdornment: (
                    <Search sx={{ mr: 1, color: "text.secondary" }} />
                  ),
                }}
                helperText={searchQuery.trim() ? `Đang tìm: "${searchQuery}"` : "Tìm kiếm độc lập với bộ lọc"}
              />
            </Grid>

            {/* Connector Type Filter with Smart Suggestions */}
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Loại cổng sạc (độc lập)</InputLabel>
                <Select
                  value={filters.connectorTypes || []}
                  multiple
                  onChange={(e) => {
                    console.log("Selected connectors:", e.target.value);
                    updateFilters({ connectorTypes: e.target.value });
                  }}
                  renderValue={(selected) => selected.join(', ')}
                >
                  {Object.values(CONNECTOR_TYPES).map((type) => {
                    const isVehicleCompatible = getCurrentVehicleConnectors().includes(type);
                    return (
                      <MenuItem key={type} value={type}>
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                          {type}
                          {isVehicleCompatible && (
                            <Chip
                              size="small"
                              label="Xe của bạn"
                              color="primary"
                              sx={{ ml: 'auto', fontSize: '0.7rem', height: '20px' }}
                            />
                          )}
                        </Box>
                      </MenuItem>
                    );
                  })}
                </Select>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                  {filters.connectorTypes && filters.connectorTypes.length > 0 ? 
                    `Đã chọn: ${filters.connectorTypes.join(', ')}` :
                    "Có thể chọn nhiều loại cổng"
                  }
                  {getCurrentVehicleConnectors().length > 0 && (
                    <span> • Xe hỗ trợ: {getCurrentVehicleConnectors().join(', ')}</span>
                  )}
                </Typography>
              </FormControl>
            </Grid>

            {/* Clear Filters Button */}
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => {
                  setSearchQuery("");
                  updateFilters({ connectorTypes: [] });
                }}
                startIcon={<FilterList />}
              >
                Xóa bộ lọc
              </Button>
            </Grid>

            {/* Filter Status Info */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                <Typography variant="body2" color="text.primary">
                  <strong>Kết quả: {filteredStations.length} trạm</strong>
                </Typography>
                
                {searchQuery.trim() && (
                  <Chip 
                    label={`Tìm kiếm: "${searchQuery}"`}
                    color="primary"
                    variant="outlined"
                    size="small"
                    onDelete={() => setSearchQuery("")}
                  />
                )}
                
                {filters.connectorTypes && filters.connectorTypes.length > 0 && (
                  <Chip 
                    label={`Cổng sạc: ${filters.connectorTypes.join(', ')}`}
                    color="secondary"
                    variant="outlined"
                    size="small"
                    onDelete={() => updateFilters({ connectorTypes: [] })}
                  />
                )}
                
                {filters.maxDistance && (
                  <Chip 
                    label={`Trong vòng ${filters.maxDistance}km`}
                    color="info"
                    variant="outlined"
                    size="small"
                  />
                )}
              </Box>
              
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                💡 Mẹo: Bạn có thể tìm kiếm tên trạm và chọn loại cổng sạc độc lập với nhau
              </Typography>
              
              {import.meta.env.DEV && (
                <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Button 
                    size="small" 
                    variant="outlined" 
                    onClick={() => {
                      console.log("=== DEBUG INFO ===");
                      console.log("Store stations:", stations);
                      console.log("Mock stations:", mockStations);
                      console.log("Current search:", searchQuery);
                      console.log("Current filters:", filters);
                      console.log("Filtered results:", filteredStations);
                    }}
                  >
                    Debug Console
                  </Button>
                  <Button 
                    size="small" 
                    variant="outlined" 
                    color="success"
                    onClick={() => {
                      console.log("🧪 Quick Test: Setting search to 'Green'");
                      setSearchQuery("Green");
                    }}
                  >
                    Test "Green"
                  </Button>
                  <Button 
                    size="small" 
                    variant="outlined" 
                    color="info"
                    onClick={() => {
                      console.log("🧪 Quick Test: Setting search to 'Mall'");
                      setSearchQuery("Mall");
                    }}
                  >
                    Test "Mall"
                  </Button>
                </Box>
              )}
            </Grid>




          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Station List */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {loading ? "Đang tải..." : `${filteredStations.length} ${getText("stations.stationsFound")}`}
              </Typography>

              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                  <Typography>Đang tìm trạm sạc gần bạn...</Typography>
                </Box>
              ) : filteredStations.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Typography variant="h6" gutterBottom>
                    Không tìm thấy trạm sạc phù hợp
                  </Typography>
                  
                  {searchQuery.trim() && (
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      • Không có trạm nào khớp với từ khóa "{searchQuery}"
                    </Typography>
                  )}
                  
                  {filters.connectorTypes && filters.connectorTypes.length > 0 && (
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      • Không có trạm nào có loại cổng sạc: {filters.connectorTypes.join(', ')}
                    </Typography>
                  )}
                  
                  {filters.maxDistance && (
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      • Không có trạm nào trong bán kính {filters.maxDistance}km
                    </Typography>
                  )}
                  
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                    💡 Thử mở rộng bán kính tìm kiếm, thay đổi từ khóa, hoặc chọn loại cổng sạc khác
                  </Typography>
                  
                  <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                    {searchQuery.trim() && (
                      <Button 
                        variant="outlined" 
                        size="small" 
                        onClick={() => setSearchQuery("")}
                      >
                        Xóa từ khóa tìm kiếm
                      </Button>
                    )}
                    {filters.connectorTypes && filters.connectorTypes.length > 0 && (
                      <Button 
                        variant="outlined" 
                        size="small" 
                        onClick={() => updateFilters({ connectorTypes: [] })}
                      >
                        Xóa bộ lọc cổng sạc
                      </Button>
                    )}
                    <Button 
                      variant="outlined" 
                      size="small" 
                      onClick={() => {
                        setSearchQuery("");
                        updateFilters({ connectorTypes: [], maxDistance: 50 });
                      }}
                    >
                      Xóa tất cả bộ lọc
                    </Button>
                  </Box>
                </Box>
              ) : (
                <List>
                  {filteredStations.map((station, index) => (
                    <React.Fragment key={station.id}>
                      <ListItem
                        onClick={() => setSelectedStation(station)}
                        sx={{
                          borderRadius: 2,
                          mb: 1,
                          border: selectedStation?.id === station.id ? 2 : 1,
                          borderColor:
                            selectedStation?.id === station.id
                              ? "primary.main"
                              : "divider",
                          "&:hover": {
                            backgroundColor: "grey.50",
                          },
                          cursor: "pointer",
                        }}
                      >
                        <ListItemIcon>
                          <Avatar
                            src={getStationImage(station)}
                            sx={{ width: 60, height: 60 }}
                          >
                            <ElectricCar />
                          </Avatar>
                        </ListItemIcon>

                        <ListItemText
                          primary={
                            <span
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "start",
                              }}
                            >
                              <span style={{ fontWeight: "bold", fontSize: "1.25rem" }}>
                                {station.name}
                              </span>
                              {getStatusChip(station)}
                            </span>
                          }
                          secondary={
                            <span>
                              <span
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "4px",
                                  marginBottom: "4px",
                                }}
                              >
                                <LocationOn
                                  sx={{ fontSize: 16, color: "text.secondary" }}
                                />
                                <span
                                  style={{
                                    fontSize: "0.875rem",
                                    color: "rgba(0, 0, 0, 0.6)",
                                  }}
                                >
                                  {station.location.address} •{" "}
                                  {getDistanceToStation(station)}{getText("units.km")} {getText("stations.away")}
                                </span>
                              </span>

                              <span
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px",
                                  marginBottom: "4px",
                                }}
                              >
                                <span
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "2px",
                                  }}
                                >
                                  <Speed
                                    sx={{ fontSize: 16, color: "primary.main" }}
                                  />
                                  <span style={{ fontSize: "0.875rem" }}>
                                    {getText("stations.upTo")} {station.charging.maxPower}{getText("units.kw")}
                                  </span>
                                </span>

                                <span
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "2px",
                                  }}
                                >
                                  <span
                                    style={{
                                      fontSize: 16,
                                      color: "#4caf50",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    {getText("units.vnd")}
                                  </span>
                                  <span style={{ fontSize: "0.875rem" }}>
                                    {getText("stations.from")}{" "}
                                    {formatCurrency(
                                      station.charging.pricing.acRate
                                    )}
                                    {getText("units.perKwh")}
                                  </span>
                                </span>
                              </span>

                              <span
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "4px",
                                }}
                              >
                                <Rating
                                  value={station.ratings.overall}
                                  precision={0.1}
                                  size="small"
                                  readOnly
                                />
                                <span
                                  style={{
                                    fontSize: "0.75rem",
                                    color: "rgba(0, 0, 0, 0.6)",
                                  }}
                                >
                                  {station.ratings.overall} (
                                  {station.ratings.totalReviews} {getText("stations.reviews")})
                                </span>
                              </span>
                            </span>
                          }
                        />

                        <Button
                          variant="contained"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBookStation(station);
                          }}
                          sx={{ ml: 2 }}
                        >
                          {getText("stations.bookNow")}
                        </Button>
                      </ListItem>

                      {index < filteredStations.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Station Details */}
        <Grid item xs={12} md={4}>
          {selectedStation ? (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {selectedStation.name}
                </Typography>

                <Box
                  component="img"
                  src={getStationImage(selectedStation)}
                  alt={selectedStation.name}
                  sx={{
                    width: "100%",
                    height: 200,
                    objectFit: "cover",
                    borderRadius: 2,
                    mb: 2,
                  }}
                />

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    color: "text.secondary",
                    fontSize: "0.875rem",
                    mb: 1,
                  }}
                >
                  <LocationOn sx={{ fontSize: 16, mr: 0.5 }} />
                  {selectedStation.location.address}
                </Box>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {getText("stations.distance")}: {getDistanceToStation(selectedStation)}{getText("units.km")}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" gutterBottom>
                  {getText("stations.chargingInfo")}
                </Typography>
                <Box sx={{ fontSize: "0.875rem", mb: 1 }}>
                  • {getText("stations.maxPower")}: {selectedStation.charging.maxPower}{getText("units.kw")}
                </Box>
                <Box sx={{ fontSize: "0.875rem", mb: 1 }}>
                  • {getText("stations.availablePorts")}: {selectedStation.charging.availablePorts}/
                  {selectedStation.charging.totalPorts}
                </Box>
                <Box sx={{ fontSize: "0.875rem", mb: 1 }}>
                  • {getText("stations.connectorTypes")}:{" "}
                  {selectedStation.charging.connectorTypes.join(", ")}
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" gutterBottom>
                  {getText("stations.pricing")}
                </Typography>
                <Box sx={{ fontSize: "0.875rem", mb: 1 }}>
                  • {getText("stations.acCharging")}:{" "}
                  {formatCurrency(selectedStation.charging.pricing.acRate)}{getText("units.perKwh")}
                </Box>
                {selectedStation.charging.pricing.dcRate && (
                  <Box sx={{ fontSize: "0.875rem", mb: 1 }}>
                    • {getText("stations.dcCharging")}:{" "}
                    {formatCurrency(selectedStation.charging.pricing.dcRate)}
                    {getText("units.perKwh")}
                  </Box>
                )}
                {selectedStation.charging.pricing.parkingFee > 0 && (
                  <Box sx={{ fontSize: "0.875rem", mb: 1 }}>
                    • {getText("stations.parking")}:{" "}
                    {formatCurrency(
                      selectedStation.charging.pricing.parkingFee
                    )}
                    {getText("units.perHour")}
                  </Box>
                )}

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={() => handleBookStation(selectedStation)}
                  sx={{ mt: 2 }}
                >
                  {getText("stations.bookThisStation")}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {getText("stations.selectStation")}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {getText("stations.selectStationDescription")}
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      {/* Booking Modal */}
      <BookingModal
        open={bookingModalOpen}
        onClose={handleBookingModalClose}
        station={stationToBook}
      />

      {/* Success Snackbar */}
      <Snackbar
        open={bookingSuccess}
        autoHideDuration={6000}
        onClose={() => setBookingSuccess(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setBookingSuccess(false)}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {bookingMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FindStations;
