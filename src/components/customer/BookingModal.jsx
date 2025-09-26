import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Grid,
  Chip,
  Alert,
  FormControlLabel,
  Checkbox,
  Divider,
  IconButton,
  CircularProgress,
  ButtonBase,
} from "@mui/material";
import {
  Close,
  ElectricCar,
  FlashOn,
  CheckCircle,
  Schedule,
  LocationOn,
} from "@mui/icons-material";
import useBookingStore from "../../store/bookingStore";
import ChargingDateTimePicker from "../ui/ChargingDateTimePicker/ChargingDateTimePicker";

const BookingModal = ({ open, onClose, station, onBookingComplete }) => {
  const { createBooking } = useBookingStore();
  const [activeStep, setActiveStep] = useState(0);
  const [selectedChargerType, setSelectedChargerType] = useState(null);
  const [selectedConnector, setSelectedConnector] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bookingResult, setBookingResult] = useState(null); // 'success', 'error', null
  const [resultMessage, setResultMessage] = useState("");

  const steps = [
    "Chọn loại máy sạc",
    "Chọn đầu sạc", 
    "Chọn ngày giờ sạc",
    "Chọn slot trống",
    "Xác nhận đặt",
  ];

  // Các loại máy sạc theo công suất
  const chargerTypes = [
    {
      id: "slow",
      name: "Sạc chậm",
      power: "7-22 kW",
      price: "5,000 VNĐ/kWh",
      time: "6-8 giờ",
      description: "Phù hợp cho sạc qua đêm",
      color: "success",
      icon: <Schedule />,
    },
    {
      id: "fast",
      name: "Sạc nhanh",
      power: "50-100 kW",
      price: "8,000 VNĐ/kWh",
      time: "1-2 giờ",
      description: "Phù hợp cho sạc trong ngày",
      color: "warning",
      icon: <FlashOn />,
    },
    {
      id: "ultra",
      name: "Sạc siêu nhanh",
      power: "150-350 kW",
      price: "12,000 VNĐ/kWh",
      time: "15-30 phút",
      description: "Sạc nhanh nhất, tiện lợi",
      color: "error",
      icon: <ElectricCar />,
    },
  ];

  // Các loại đầu sạc
  const connectorTypes = {
    slow: [
      { id: "type2", name: "Type 2 (AC)", compatible: "Tesla, VinFast, BMW" },
      { id: "ccs2", name: "CCS2 (AC)", compatible: "Hyundai, Kia, Audi" },
    ],
    fast: [
      { id: "chademo", name: "CHAdeMO", compatible: "Nissan Leaf, Mitsubishi" },
      { id: "ccs2_dc", name: "CCS2 (DC)", compatible: "BMW, Mercedes, VW" },
    ],
    ultra: [
      {
        id: "ccs2_ultra",
        name: "CCS2 Ultra",
        compatible: "Tesla Model S/3/X/Y",
      },
      {
        id: "supercharger",
        name: "Tesla Supercharger",
        compatible: "Tesla only",
      },
    ],
  };

  // Mock available slots based on charger type and connector
  const getAvailableSlots = (chargerType, connector) => {
    const mockSlots = [
      {
        id: "A01",
        status: "available",
        estimatedWaitTime: 0,
        location: "Khu vực A - Slot 01",
      },
      {
        id: "A02",
        status: "available",
        estimatedWaitTime: 0,
        location: "Khu vực A - Slot 02",
      },
      {
        id: "B01",
        status: "occupied",
        estimatedWaitTime: 45,
        location: "Khu vực B - Slot 01",
      },
      {
        id: "B02",
        status: "available",
        estimatedWaitTime: 0,
        location: "Khu vực B - Slot 02",
      },
    ];
    return mockSlots.filter((slot) => slot.status === "available");
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleChargerTypeSelect = (chargerType) => {
    setSelectedChargerType(chargerType);
    setSelectedConnector(null);
    setSelectedSlot(null);
  };

  const handleConnectorSelect = (connector) => {
    setSelectedConnector(connector);
    setSelectedDateTime(null);
    setSelectedSlot(null);
  };

  const handleDateTimeChange = (dateTimeData) => {
    setSelectedDateTime(dateTimeData);
    setSelectedSlot(null); // Reset slot when date/time changes
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
  };

  const handleConfirmBooking = async () => {
    if (!agreeTerms) {
      setResultMessage("Vui lòng đồng ý với quy định đặt trạm sạc");
      setBookingResult("error");
      return;
    }

    setLoading(true);
    setBookingResult(null);

    try {
      // Simulate booking API call with random success/failure
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // 90% success rate for demo
          if (Math.random() > 0.1) {
            resolve();
          } else {
            reject(new Error("Hệ thống đang bận, vui lòng thử lại"));
          }
        }, 2500); // Longer loading for better UX demo
      });

      const bookingData = {
        stationId: station.id,
        stationName: station.name,
        chargerType: selectedChargerType,
        connector: selectedConnector,
        slot: selectedSlot,
        bookingTime: new Date().toISOString(),
        schedulingType: selectedDateTime?.schedulingType || 'immediate',
        scheduledDateTime: selectedDateTime?.scheduledDateTime || null,
        scheduledDate: selectedDateTime?.scheduledDate ? selectedDateTime.scheduledDate.toISOString().split('T')[0] : null,
        scheduledTime: selectedDateTime?.scheduledTime ? selectedDateTime.scheduledTime.toISOString() : null,
      };

      // Create booking using store
      const newBooking = createBooking(bookingData);

      setBookingResult("success");
      setResultMessage(
        `Đặt chỗ thành công! Mã đặt chỗ: ${newBooking.id}. Vui lòng đến trạm trong vòng 15 phút.`
      );

      // Auto close after showing success for 3 seconds
      setTimeout(() => {
        onBookingComplete(newBooking);
        handleCloseModal();
      }, 3000);
    } catch (error) {
      console.error("Booking failed:", error);
      setBookingResult("error");
      setResultMessage(
        error.message || "Đặt chỗ thất bại. Vui lòng thử lại sau."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    // Reset all states
    setActiveStep(0);
    setSelectedChargerType(null);
    setSelectedConnector(null);
    setSelectedSlot(null);
    setSelectedDateTime(null);
    setAgreeTerms(false);
    setLoading(false);
    setBookingResult(null);
    setResultMessage("");
    onClose();
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Chọn loại máy sạc phù hợp
            </Typography>
            <Grid container spacing={2}>
              {chargerTypes.map((type) => (
                <Grid item xs={12} key={type.id}>
                  <ButtonBase
                    onClick={() => handleChargerTypeSelect(type)}
                    sx={{ width: "100%", borderRadius: 1 }}
                  >
                    <Card
                      sx={{
                        width: "100%",
                        cursor: "pointer",
                        border: selectedChargerType?.id === type.id ? 2 : 1,
                        borderColor:
                          selectedChargerType?.id === type.id
                            ? "primary.main"
                            : "divider",
                        "&:hover": {
                          boxShadow: 2,
                        },
                      }}
                    >
                      <CardContent>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Box sx={{ mr: 2, color: `${type.color}.main` }}>
                              {type.icon}
                            </Box>
                            <Box>
                              <Typography variant="h6" fontWeight="bold">
                                {type.name}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {type.description}
                              </Typography>
                            </Box>
                          </Box>
                          <Box sx={{ textAlign: "right" }}>
                            <Chip
                              label={type.power}
                              color={type.color}
                              size="small"
                              sx={{ mb: 1 }}
                            />
                            <Typography variant="body2" fontWeight="bold">
                              {type.price}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Thời gian: {type.time}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </ButtonBase>
                </Grid>
              ))}
            </Grid>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Chọn loại đầu sạc
            </Typography>
            {selectedChargerType && (
              <>
                <Alert severity="info" sx={{ mb: 2 }}>
                  Đã chọn: {selectedChargerType.name} (
                  {selectedChargerType.power})
                </Alert>
                <Grid container spacing={2}>
                  {connectorTypes[selectedChargerType.id]?.map((connector) => (
                    <Grid item xs={12} sm={6} key={connector.id}>
                      <ButtonBase
                        onClick={() => handleConnectorSelect(connector)}
                        sx={{ width: "100%", borderRadius: 1 }}
                      >
                        <Card
                          sx={{
                            width: "100%",
                            cursor: "pointer",
                            border:
                              selectedConnector?.id === connector.id ? 2 : 1,
                            borderColor:
                              selectedConnector?.id === connector.id
                                ? "primary.main"
                                : "divider",
                            "&:hover": {
                              boxShadow: 2,
                            },
                          }}
                        >
                          <CardContent>
                            <Typography variant="h6" fontWeight="bold">
                              {connector.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Tương thích: {connector.compatible}
                            </Typography>
                          </CardContent>
                        </Card>
                      </ButtonBase>
                    </Grid>
                  ))}
                </Grid>
              </>
            )}
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Chọn ngày và giờ sạc
            </Typography>
            {selectedConnector && (
              <>
                <Alert severity="success" sx={{ mb: 2 }}>
                  Đã chọn: {selectedConnector.name}
                </Alert>
                <ChargingDateTimePicker
                  station={station}
                  onDateTimeChange={handleDateTimeChange}
                  initialDateTime={selectedDateTime}
                />
              </>
            )}
          </Box>
        );

      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Chọn slot trống phù hợp
            </Typography>
            {selectedDateTime && (selectedDateTime.schedulingType === 'immediate' || selectedDateTime.isValid) && (
              <>
                <Alert severity="success" sx={{ mb: 2 }}>
                  {selectedDateTime.schedulingType === 'immediate' 
                    ? "Sạc ngay khi đến trạm"
                    : `Đã lên lịch: ${selectedDateTime.scheduledDateTime?.toLocaleString('vi-VN')}`
                  }
                </Alert>
                <Grid container spacing={2}>
                  {getAvailableSlots(
                    selectedChargerType,
                    selectedConnector
                  ).map((slot) => (
                    <Grid item xs={12} sm={6} key={slot.id}>
                      <ButtonBase
                        onClick={() => handleSlotSelect(slot)}
                        sx={{ width: "100%", borderRadius: 1 }}
                      >
                        <Card
                          sx={{
                            width: "100%",
                            cursor: "pointer",
                            border: selectedSlot?.id === slot.id ? 2 : 1,
                            borderColor:
                              selectedSlot?.id === slot.id
                                ? "primary.main"
                                : "divider",
                            "&:hover": {
                              boxShadow: 2,
                            },
                          }}
                        >
                          <CardContent>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                              }}
                            >
                              <Box>
                                <Typography variant="h6" fontWeight="bold">
                                  {slot.id}
                                </Typography>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    color: "text.secondary",
                                    fontSize: "0.875rem",
                                  }}
                                >
                                  <LocationOn sx={{ fontSize: 16, mr: 0.5 }} />
                                  {slot.location}
                                </Box>
                              </Box>
                              <Chip
                                label="Sẵn sàng"
                                color="success"
                                size="small"
                                icon={<CheckCircle />}
                              />
                            </Box>
                          </CardContent>
                        </Card>
                      </ButtonBase>
                    </Grid>
                  ))}
                </Grid>
              </>
            )}
            {selectedDateTime && !selectedDateTime.isValid && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                Vui lòng chọn ngày và giờ hợp lệ trước khi tiếp tục
              </Alert>
            )}
          </Box>
        );

      case 4:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Chọn slot trống phù hợp
            </Typography>
            {selectedConnector && (
              <>
                <Alert severity="success" sx={{ mb: 2 }}>
                  Đã chọn: {selectedConnector.name}
                </Alert>
                <Grid container spacing={2}>
                  {getAvailableSlots(
                    selectedChargerType,
                    selectedConnector
                  ).map((slot) => (
                    <Grid item xs={12} sm={6} key={slot.id}>
                      <ButtonBase
                        onClick={() => handleSlotSelect(slot)}
                        sx={{ width: "100%", borderRadius: 1 }}
                      >
                        <Card
                          sx={{
                            width: "100%",
                            cursor: "pointer",
                            border: selectedSlot?.id === slot.id ? 2 : 1,
                            borderColor:
                              selectedSlot?.id === slot.id
                                ? "primary.main"
                                : "divider",
                            "&:hover": {
                              boxShadow: 2,
                            },
                          }}
                        >
                          <CardContent>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                              }}
                            >
                              <Box>
                                <Typography variant="h6" fontWeight="bold">
                                  {slot.id}
                                </Typography>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    color: "text.secondary",
                                    fontSize: "0.875rem",
                                  }}
                                >
                                  <LocationOn sx={{ fontSize: 16, mr: 0.5 }} />
                                  {slot.location}
                                </Box>
                              </Box>
                              <Chip
                                label="Sẵn sàng"
                                color="success"
                                size="small"
                                icon={<CheckCircle />}
                              />
                            </Box>
                          </CardContent>
                        </Card>
                      </ButtonBase>
                    </Grid>
                  ))}
                </Grid>
              </>
            )}
          </Box>
        );

      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Xác nhận thông tin đặt chỗ
            </Typography>

            {/* Booking Summary */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Thông tin đặt chỗ
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Trạm sạc:
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {station?.name}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Loại máy sạc:
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {selectedChargerType?.name} ({selectedChargerType?.power})
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Đầu sạc:
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {selectedConnector?.name}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Slot:
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {selectedSlot?.id} - {selectedSlot?.location}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Lịch sạc:
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {selectedDateTime?.schedulingType === 'immediate' 
                        ? "Sạc ngay" 
                        : selectedDateTime?.scheduledDateTime?.toLocaleString('vi-VN') || 'Chưa chọn'
                      }
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Giá dự kiến:
                    </Typography>
                    <Typography
                      variant="h6"
                      color="primary.main"
                      fontWeight="bold"
                    >
                      {selectedChargerType?.price}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Terms and Conditions */}
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Quy định đặt trạm sạc
                </Typography>
                <Box
                  sx={{
                    maxHeight: 200,
                    overflowY: "auto",
                    mb: 2,
                    scrollbarWidth: "none",
                    "-ms-overflow-style": "none",
                    "&::-webkit-scrollbar": {
                      width: "0px",
                      background: "transparent",
                    },
                  }}
                >
                  <Typography variant="body2" paragraph>
                    <strong>1. Thời gian giữ chỗ:</strong> Slot sẽ được giữ
                    trong 15 phút kể từ khi đặt. Sau thời gian này, slot sẽ được
                    tự động hủy nếu bạn không đến.
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>2. Thanh toán:</strong> Thanh toán được thực hiện
                    sau khi sạc hoàn tất theo số kWh thực tế sử dụng.
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>3. Hủy đặt chỗ:</strong> Bạn có thể hủy đặt chỗ miễn
                    phí trong vòng 5 phút đầu sau khi đặt.
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>4. Thời gian sạc tối đa:</strong>- Sạc chậm: 8 giờ -
                    Sạc nhanh: 3 giờ - Sạc siêu nhanh: 1 giờ
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>5. Phí phạt:</strong> Nếu để xe quá thời gian quy
                    định, sẽ tính phí phạt 50,000 VNĐ/giờ.
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>6. An toàn:</strong> Vui lòng tuân thủ các quy định
                    an toàn tại trạm sạc và không để lại xe không có người giám
                    sát.
                  </Typography>
                </Box>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Tôi đồng ý với các quy định trên"
                />
              </CardContent>
            </Card>
          </Box>
        );

      default:
        return null;
    }
  };

  const isStepComplete = (step) => {
    switch (step) {
      case 0:
        return selectedChargerType !== null;
      case 1:
        return selectedConnector !== null;
      case 2:
        return selectedDateTime !== null && (selectedDateTime.schedulingType === 'immediate' || selectedDateTime.isValid);
      case 3:
        return selectedSlot !== null;
      case 4:
        return agreeTerms;
      default:
        return false;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: "70vh" },
      }}
    >
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h5" fontWeight="bold">
            Đặt chỗ sạc xe - {station?.name}
          </Typography>
          <IconButton onClick={handleCloseModal} disabled={loading}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label, index) => (
            <Step key={label} completed={isStepComplete(index)}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {renderStepContent()}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleCloseModal} disabled={loading}>
          Hủy
        </Button>
        <Box sx={{ flex: 1 }} />
        {activeStep > 0 && (
          <Button onClick={handleBack} disabled={loading}>
            Quay lại
          </Button>
        )}
        {activeStep < steps.length - 1 ? (
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={!isStepComplete(activeStep) || loading}
          >
            Tiếp theo
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleConfirmBooking}
            disabled={!agreeTerms || loading}
            startIcon={
              loading ? <CircularProgress size={20} /> : <CheckCircle />
            }
          >
            {loading ? "Đang xử lý..." : "Xác nhận đặt"}
          </Button>
        )}
      </DialogActions>

      {/* Booking Result Overlay */}
      {(loading || bookingResult) && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            borderRadius: 3,
          }}
        >
          {loading && (
            <>
              <CircularProgress size={60} sx={{ mb: 3 }} />
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Đang xử lý đặt chỗ...
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Vui lòng chờ trong giây lát
              </Typography>
            </>
          )}

          {bookingResult === "success" && (
            <>
              <CheckCircle
                sx={{
                  fontSize: 80,
                  color: "success.main",
                  mb: 2,
                }}
              />
              <Typography
                variant="h5"
                fontWeight="bold"
                color="success.main"
                gutterBottom
              >
                Đặt chỗ thành công!
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                textAlign="center"
                sx={{ maxWidth: 400, mb: 2 }}
              >
                {resultMessage}
              </Typography>
              <Button
                variant="contained"
                color="success"
                onClick={handleCloseModal}
              >
                Đóng
              </Button>
            </>
          )}

          {bookingResult === "error" && (
            <>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  backgroundColor: "error.main",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h2" color="white" fontWeight="bold">
                  !
                </Typography>
              </Box>
              <Typography
                variant="h5"
                fontWeight="bold"
                color="error.main"
                gutterBottom
              >
                Đặt chỗ thất bại
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                textAlign="center"
                sx={{ maxWidth: 400, mb: 3 }}
              >
                {resultMessage}
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleCloseModal}
                >
                  Đóng
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    setBookingResult(null);
                    setResultMessage("");
                  }}
                >
                  Thử lại
                </Button>
              </Box>
            </>
          )}
        </Box>
      )}
    </Dialog>
  );
};

export default BookingModal;
