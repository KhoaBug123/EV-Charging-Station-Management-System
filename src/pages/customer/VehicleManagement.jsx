import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import useVehicleStore from "../../store/vehicleStore";
import useAuthStore from "../../store/authStore";
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    Grid,
    Avatar,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Chip,
    Alert,
    Divider,
    Container,
    Stack,
    Paper,
} from "@mui/material";
import {
    DirectionsCar,
    Add,
    Edit,
    Delete,
    ElectricCar,
    Battery80,
    Speed,
    Info,
} from "@mui/icons-material";

const VehicleManagement = () => {
    const [searchParams] = useSearchParams();

    // Store hooks
    const {
        vehicles,
        addVehicle,
        updateVehicle,
        deleteVehicle,
        setDefaultVehicle,
        initializeWithUserData
    } = useVehicleStore();
    const { user } = useAuthStore();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [formData, setFormData] = useState({
        nickname: "",
        make: "",
        model: "",
        year: "",
        batteryCapacity: "",
        maxChargingSpeed: "",
        connectorTypes: [], // Changed to array
        licensePlate: "",
        color: "",
        isDefault: false,
    });

    // Initialize store with user data
    useEffect(() => {
        if (user) {
            initializeWithUserData(user);
        }
    }, [user, initializeWithUserData]);

    // Handle query parameters for navigation from CustomerProfile
    useEffect(() => {
        const editId = searchParams.get('edit');
        const shouldAdd = searchParams.get('add');

        if (editId && vehicles.length > 0) {
            const vehicleToEdit = vehicles.find(v => v.id === editId);
            if (vehicleToEdit) {
                handleEdit(vehicleToEdit);
            }
        } else if (shouldAdd === 'true') {
            handleAddNew();
        }
    }, [searchParams, vehicles]);

    // Remove mock data, use store instead
    /* const [vehicles, setVehicles] = useState([
    // Mock data removed - now using store
    */

    const makeOptions = [
        "VinFast",
        "Tesla",
        "BYD",
        "Hyundai",
        "Kia",
        "BMW",
        "Mercedes-Benz",
        "Audi",
        "Nissan",
        "Mitsubishi",
        "Khác",
    ];

    const connectorTypes = [
        { value: "CCS2", label: "CCS2 (Combined Charging System)" },
        { value: "CHAdeMO", label: "CHAdeMO" },
        { value: "Type2", label: "Type 2 (AC)" },
        { value: "Tesla", label: "Tesla Supercharger" },
    ];

    const handleAddNew = () => {
        setSelectedVehicle(null);
        setFormData({
            nickname: "",
            make: "",
            model: "",
            year: "",
            batteryCapacity: "",
            maxChargingSpeed: "",
            connectorTypes: [],
            licensePlate: "",
            color: "",
            isDefault: false,
        });
        setDialogOpen(true);
    };

    const handleEdit = (vehicle) => {
        setSelectedVehicle(vehicle);
        setFormData({
            nickname: vehicle.nickname,
            make: vehicle.make,
            model: vehicle.model,
            year: vehicle.year,
            batteryCapacity: vehicle.batteryCapacity,
            maxChargingSpeed: vehicle.maxChargingSpeed,
            connectorTypes: vehicle.connectorTypes || [vehicle.connectorType].filter(Boolean),
            licensePlate: vehicle.licensePlate,
            color: vehicle.color,
            isDefault: vehicle.isDefault,
        });
        setDialogOpen(true);
    };

    const handleDelete = (vehicleId) => {
        deleteVehicle(vehicleId);
    };

    const handleSetDefault = (vehicleId) => {
        setDefaultVehicle(vehicleId);
    };

    const handleSave = () => {
        if (selectedVehicle) {
            // Update existing vehicle
            updateVehicle(selectedVehicle.id, formData);
        } else {
            // Add new vehicle
            addVehicle(formData);
        }
        setDialogOpen(false);
    };

    const getConnectorTypeLabel = (types) => {
        if (Array.isArray(types)) {
            return types.map(type => {
                const connector = connectorTypes.find(c => c.value === type);
                return connector ? connector.label : type;
            }).join(', ');
        }
        // Fallback for single type (backward compatibility)
        const connector = connectorTypes.find(c => c.value === types);
        return connector ? connector.label : types;
    };

    return (
        <Container maxWidth="lg" sx={{ py: 3 }}>
            {/* Modern Header */}
            <Paper
                elevation={0}
                sx={{
                    mb: 4,
                    background: "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)",
                    borderRadius: 4,
                    p: 4,
                    color: "white",
                    position: "relative",
                    overflow: "hidden",
                    "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        right: 0,
                        width: "30%",
                        height: "100%",
                        background: "radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)",
                        backgroundSize: "20px 20px",
                    }
                }}
            >
                <Stack direction={{ xs: "column", md: "row" }} spacing={3} alignItems="center" justifyContent="space-between">
                    <Stack direction="row" alignItems="center" spacing={3}>
                        <Avatar
                            sx={{
                                width: 80,
                                height: 80,
                                background: "rgba(255,255,255,0.2)",
                                backdropFilter: "blur(10px)",
                                border: "2px solid rgba(255,255,255,0.3)",
                            }}
                        >
                            <DirectionsCar sx={{ fontSize: 40, color: "white" }} />
                        </Avatar>
                        <Box>
                            <Typography variant="h4" fontWeight="bold" gutterBottom>
                                🚗 Quản lý xe điện
                            </Typography>
                            <Typography variant="h6" sx={{ opacity: 0.9 }}>
                                Quản lý thông tin các phương tiện điện của bạn
                            </Typography>
                        </Box>
                    </Stack>
                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<Add />}
                        onClick={handleAddNew}
                        sx={{
                            background: "rgba(255,255,255,0.2)",
                            backdropFilter: "blur(10px)",
                            border: "1px solid rgba(255,255,255,0.3)",
                            "&:hover": { background: "rgba(255,255,255,0.3)" },
                            minWidth: 150,
                        }}
                    >
                        Thêm xe mới
                    </Button>
                </Stack>
            </Paper>

            {/* Info Alert */}
            <Alert severity="info" sx={{ mb: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Info />
                    <Typography variant="body2">
                        Thông tin xe giúp hệ thống đề xuất trạm sạc và cài đặt sạc phù hợp với xe của bạn.
                    </Typography>
                </Box>
            </Alert>

            {/* Vehicle List */}
            {vehicles.length === 0 ? (
                <Card>
                    <CardContent sx={{ textAlign: "center", py: 8 }}>
                        <ElectricCar sx={{ fontSize: 60, color: "grey.400", mb: 2 }} />
                        <Typography variant="h6" color="text.secondary">
                            Chưa có xe nào được thêm
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Thêm thông tin xe điện của bạn để có trải nghiệm tốt nhất
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            onClick={handleAddNew}
                        >
                            Thêm xe đầu tiên
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <Grid container spacing={3}>
                    {vehicles.map((vehicle) => (
                        <Grid item xs={12} md={6} key={vehicle.id}>
                            <Card
                                sx={{
                                    border: vehicle.isDefault ? 2 : 1,
                                    borderColor: vehicle.isDefault ? "primary.main" : "divider",
                                }}
                            >
                                <CardContent>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "flex-start",
                                            mb: 2,
                                        }}
                                    >
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                            <Avatar
                                                sx={{
                                                    bgcolor: vehicle.isDefault ? "primary.main" : "grey.300",
                                                }}
                                            >
                                                <ElectricCar />
                                            </Avatar>
                                            <Box>
                                                <Typography variant="h6" fontWeight="bold">
                                                    {vehicle.nickname}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {vehicle.make} {vehicle.model} ({vehicle.year})
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Box sx={{ display: "flex", gap: 1 }}>
                                            <IconButton size="small" onClick={() => handleEdit(vehicle)}>
                                                <Edit />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => handleDelete(vehicle.id)}
                                                disabled={vehicle.isDefault}
                                            >
                                                <Delete />
                                            </IconButton>
                                        </Box>
                                    </Box>

                                    {vehicle.isDefault && (
                                        <Chip
                                            label="Xe mặc định"
                                            size="small"
                                            color="primary"
                                            sx={{ mb: 2 }}
                                        />
                                    )}

                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                                <Battery80 sx={{ fontSize: 16, color: "success.main" }} />
                                                <Typography variant="body2" color="text.secondary">
                                                    Dung lượng pin
                                                </Typography>
                                            </Box>
                                            <Typography variant="body1" fontWeight="medium">
                                                {vehicle.batteryCapacity} kWh
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={6}>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                                <Speed sx={{ fontSize: 16, color: "info.main" }} />
                                                <Typography variant="body2" color="text.secondary">
                                                    Tốc độ sạc tối đa
                                                </Typography>
                                            </Box>
                                            <Typography variant="body1" fontWeight="medium">
                                                {vehicle.maxChargingSpeed} kW
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Typography variant="body2" color="text.secondary">
                                                Loại cổng sạc: {getConnectorTypeLabel(vehicle.connectorTypes || [vehicle.connectorType].filter(Boolean))}
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Typography variant="body2" color="text.secondary">
                                                Biển số: <strong>{vehicle.licensePlate}</strong> • Màu: <strong>{vehicle.color}</strong>
                                            </Typography>
                                        </Grid>
                                    </Grid>

                                    <Divider sx={{ my: 2 }} />

                                    {!vehicle.isDefault && (
                                        <Button
                                            size="small"
                                            onClick={() => handleSetDefault(vehicle.id)}
                                        >
                                            Đặt làm xe mặc định
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Add/Edit Vehicle Dialog */}
            <Dialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    {selectedVehicle ? "Chỉnh sửa thông tin xe" : "Thêm xe mới"}
                </DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Tên gọi (Nickname)"
                                value={formData.nickname}
                                onChange={(e) =>
                                    setFormData({ ...formData, nickname: e.target.value })
                                }
                                placeholder="VD: Xe chính, Xe gia đình..."
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Hãng xe</InputLabel>
                                <Select
                                    value={formData.make}
                                    label="Hãng xe"
                                    onChange={(e) =>
                                        setFormData({ ...formData, make: e.target.value })
                                    }
                                >
                                    {makeOptions.map((make) => (
                                        <MenuItem key={make} value={make}>
                                            {make}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Model"
                                value={formData.model}
                                onChange={(e) =>
                                    setFormData({ ...formData, model: e.target.value })
                                }
                                placeholder="VD: VF8, Model 3..."
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Năm sản xuất"
                                value={formData.year}
                                onChange={(e) =>
                                    setFormData({ ...formData, year: e.target.value })
                                }
                                placeholder="VD: 2024"
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Dung lượng pin (kWh)"
                                value={formData.batteryCapacity}
                                onChange={(e) =>
                                    setFormData({ ...formData, batteryCapacity: e.target.value })
                                }
                                placeholder="VD: 87.7"
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Tốc độ sạc tối đa (kW)"
                                value={formData.maxChargingSpeed}
                                onChange={(e) =>
                                    setFormData({ ...formData, maxChargingSpeed: e.target.value })
                                }
                                placeholder="VD: 150"
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Loại cổng sạc</InputLabel>
                                <Select
                                    value={formData.connectorTypes || []}
                                    label="Loại cổng sạc"
                                    multiple
                                    onChange={(e) =>
                                        setFormData({ ...formData, connectorTypes: e.target.value })
                                    }
                                    renderValue={(selected) => selected.map(value => {
                                        const type = connectorTypes.find(t => t.value === value);
                                        return type ? type.label : value;
                                    }).join(', ')}
                                >
                                    {connectorTypes.map((type) => (
                                        <MenuItem key={type.value} value={type.value}>
                                            {type.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Biển số xe"
                                value={formData.licensePlate}
                                onChange={(e) =>
                                    setFormData({ ...formData, licensePlate: e.target.value })
                                }
                                placeholder="VD: 30A-123.45"
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Màu xe"
                                value={formData.color}
                                onChange={(e) =>
                                    setFormData({ ...formData, color: e.target.value })
                                }
                                placeholder="VD: Xanh, Trắng, Đen..."
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Hủy</Button>
                    <Button variant="contained" onClick={handleSave}>
                        {selectedVehicle ? "Cập nhật" : "Thêm xe"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default VehicleManagement;