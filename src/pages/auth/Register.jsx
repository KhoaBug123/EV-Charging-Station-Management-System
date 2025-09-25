import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Link,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import {
  ElectricCar,
  PersonAdd,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { IconButton, InputAdornment } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login, loading, error, clearError } = useAuthStore();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "customer", // Default to customer
    agreeToTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "agreeToTerms" ? checked : value,
    }));

    // Clear specific field error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    if (error) clearError();
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.firstName.trim()) {
      errors.firstName = "Tên là bắt buộc";
    }

    if (!formData.lastName.trim()) {
      errors.lastName = "Họ là bắt buộc";
    }

    if (!formData.email.trim()) {
      errors.email = "Email là bắt buộc";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email không hợp lệ";
    }

    if (!formData.phone.trim()) {
      errors.phone = "Số điện thoại là bắt buộc";
    } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ""))) {
      errors.phone = "Số điện thoại phải có 10-11 chữ số";
    }

    if (!formData.password) {
      errors.password = "Mật khẩu là bắt buộc";
    } else if (formData.password.length < 6) {
      errors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Xác nhận mật khẩu là bắt buộc";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    if (!formData.agreeToTerms) {
      errors.agreeToTerms = "Bạn phải đồng ý với điều khoản sử dụng";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // In a real app, you would call a register API here
    // For demo purposes, we'll simulate registration and auto-login
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock successful registration - auto login the user
      const mockUser = {
        id: `user-${Date.now()}`,
        email: formData.email,
        password: formData.password, // In real app, don't include password
        role: formData.role,
        profile: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          avatar: "",
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          verified: false,
        },
      };

      // Auto-login after successful registration
      const result = await login(formData.email, formData.password);

      if (result.success) {
        // Registration successful message could be shown here
        console.log("Registration and login successful");
      }
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  const roleOptions = [
    { value: "customer", label: "Khách hàng" },
    { value: "staff", label: "Nhân viên" },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1379FF 0%, #B5FF3D 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 500,
          width: "100%",
          borderRadius: 3,
          boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <ElectricCar
              sx={{
                fontSize: 48,
                color: "primary.main",
                mb: 1,
              }}
            />
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Đăng ký tài khoản
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tạo tài khoản mới để sử dụng dịch vụ SkaEV
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Registration Form */}
          <Box component="form" onSubmit={handleSubmit}>
            {/* Name Fields */}
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <TextField
                name="firstName"
                label="Tên"
                value={formData.firstName}
                onChange={handleInputChange}
                error={!!formErrors.firstName}
                helperText={formErrors.firstName}
                fullWidth
                required
              />
              <TextField
                name="lastName"
                label="Họ"
                value={formData.lastName}
                onChange={handleInputChange}
                error={!!formErrors.lastName}
                helperText={formErrors.lastName}
                fullWidth
                required
              />
            </Box>

            {/* Email */}
            <TextField
              name="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              error={!!formErrors.email}
              helperText={formErrors.email}
              fullWidth
              required
              sx={{ mb: 2 }}
            />

            {/* Phone */}
            <TextField
              name="phone"
              label="Số điện thoại"
              value={formData.phone}
              onChange={handleInputChange}
              error={!!formErrors.phone}
              helperText={formErrors.phone}
              fullWidth
              required
              sx={{ mb: 2 }}
            />

            {/* Role Selection */}
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Loại tài khoản</InputLabel>
              <Select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                label="Loại tài khoản"
              >
                {roleOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Password */}
            <TextField
              name="password"
              label="Mật khẩu"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleInputChange}
              error={!!formErrors.password}
              helperText={formErrors.password}
              fullWidth
              required
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Confirm Password */}
            <TextField
              name="confirmPassword"
              label="Xác nhận mật khẩu"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleInputChange}
              error={!!formErrors.confirmPassword}
              helperText={formErrors.confirmPassword}
              fullWidth
              required
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Terms Agreement */}
            <FormControlLabel
              control={
                <Checkbox
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  color="primary"
                />
              }
              label={
                <Typography variant="body2">
                  Tôi đồng ý với{" "}
                  <Link href="#" color="primary">
                    điều khoản sử dụng
                  </Link>{" "}
                  và{" "}
                  <Link href="#" color="primary">
                    chính sách bảo mật
                  </Link>
                </Typography>
              }
              sx={{ mb: 2 }}
            />
            {formErrors.agreeToTerms && (
              <Typography
                variant="caption"
                color="error"
                sx={{ mb: 2, display: "block" }}
              >
                {formErrors.agreeToTerms}
              </Typography>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              startIcon={
                loading ? <CircularProgress size={20} /> : <PersonAdd />
              }
              sx={{
                mb: 2,
                py: 1.5,
                fontWeight: "bold",
                color: "white",
                textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                background: "linear-gradient(135deg, #1379FF 0%, #B5FF3D 100%)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #0d5fd6 0%, #9FE830 100%)",
                  color: "white",
                  textShadow: "0 1px 2px rgba(0,0,0,0.4)",
                },
                "&:disabled": {
                  color: "rgba(255, 255, 255, 0.6)",
                  textShadow: "none",
                },
              }}
            >
              {loading ? "Đang đăng ký..." : "Đăng ký"}
            </Button>

            {/* Login Link */}
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                Đã có tài khoản?{" "}
                <Link
                  component="button"
                  type="button"
                  onClick={() => navigate("/login")}
                  color="primary"
                  sx={{ textDecoration: "none", fontWeight: "bold" }}
                >
                  Đăng nhập ngay
                </Link>
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RegisterPage;
