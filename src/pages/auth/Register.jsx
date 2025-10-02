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
  Divider,
  Grid,
} from "@mui/material";
import {
  ElectricCar,
  PersonAdd,
  Visibility,
  VisibilityOff,
  Google,
  Phone,
} from "@mui/icons-material";
import { IconButton, InputAdornment } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { getText } from "../../utils/vietnameseTexts";
import { googleAuth } from "../../services/socialAuthService";
import PhoneOTPModal from "../../components/auth/PhoneOTPModal";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { loading, error, clearError, register, socialRegister } = useAuthStore();

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

  // Social registration states
  const [socialLoading, setSocialLoading] = useState({
    google: false,
    phone: false,
  });
  const [phoneModalOpen, setPhoneModalOpen] = useState(false);

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
      errors.firstName = getText("errors.required");
    }

    if (!formData.lastName.trim()) {
      errors.lastName = getText("errors.required");
    }

    if (!formData.email.trim()) {
      errors.email = getText("errors.emailRequired");
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = getText("errors.emailInvalid");
    }

    if (!formData.phone.trim()) {
      errors.phone = getText("errors.required");
    } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ""))) {
      errors.phone = getText("errors.phoneInvalid");
    }

    if (!formData.password) {
      errors.password = getText("errors.passwordRequired");
    } else if (formData.password.length < 6) {
      errors.password = getText("errors.passwordTooShort");
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = getText("errors.required");
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

    try {
      const result = await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role,
      });

      if (result.success) {
        if (result.requiresVerification) {
          // Redirect to email verification page
          navigate(`/verify-email?email=${encodeURIComponent(formData.email)}&mode=auto`);
        } else {
          // Direct login
          navigate("/customer/dashboard");
        }
      }
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  // Social registration handlers
  const handleGoogleRegister = async () => {
    setSocialLoading({ ...socialLoading, google: true });
    try {
      const googleResult = await googleAuth.signUp();
      if (googleResult.success) {
        const authResult = await socialRegister('google', googleResult.user);
        if (authResult.success) {
          console.log("Google registration successful:", authResult.user);
          navigate("/customer/dashboard");
        }
      } else {
        console.error("Google registration failed:", googleResult.error);
      }
    } catch (error) {
      console.error("Google registration error:", error);
    } finally {
      setSocialLoading({ ...socialLoading, google: false });
    }
  };

  const handlePhoneRegister = () => {
    setPhoneModalOpen(true);
  };

  const handlePhoneOTPSuccess = async (phoneData) => {
    try {
      const authResult = await socialRegister('phone', {
        phone: phoneData.phoneNumber,
        name: phoneData.name || "Người dùng",
        email: phoneData.email || `${phoneData.phoneNumber}@skaev.temp`,
        verified: true,
      });

      if (authResult.success) {
        console.log("Phone registration successful:", authResult.user);
        setPhoneModalOpen(false);
        navigate("/customer/dashboard");
      }
    } catch (error) {
      console.error("Phone registration error:", error);
    }
  };

  const roleOptions = [
    { value: "customer", label: getText("users.customer") },
    { value: "staff", label: getText("users.staff") },
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
              {getText("auth.registerTitle")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {getText("auth.registerSubtitle")}
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
                label={getText("auth.firstName")}
                value={formData.firstName}
                onChange={handleInputChange}
                error={!!formErrors.firstName}
                helperText={formErrors.firstName}
                fullWidth
                required
              />
              <TextField
                name="lastName"
                label={getText("auth.lastName")}
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
              label={getText("auth.email")}
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
              label={getText("auth.phone")}
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
              <InputLabel>{getText("users.role")}</InputLabel>
              <Select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                label={getText("users.role")}
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
              label={getText("auth.password")}
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
              label={getText("auth.confirmPassword")}
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
                mb: 3,
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
              {loading ? getText("auth.registering") : getText("auth.register")}
            </Button>

            {/* Social Registration */}
            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Hoặc đăng ký nhanh với
              </Typography>
            </Divider>

            <Typography
              variant="caption"
              color="primary.main"
              sx={{ display: 'block', textAlign: 'center', mb: 2, fontWeight: 'medium' }}
            >
              ✨ Đăng ký trong 30 giây - Không cần điền form dài!
            </Typography>



            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={socialLoading.google ? <CircularProgress size={16} /> : <Google />}
                  onClick={handleGoogleRegister}
                  disabled={socialLoading.google || loading}
                  sx={{
                    textTransform: "none",
                    borderColor: '#db4437',
                    color: '#db4437',
                    '&:hover': { borderColor: '#db4437', bgcolor: '#db4437', color: 'white' }
                  }}
                >
                  Google
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Phone />}
                  onClick={handlePhoneRegister}
                  disabled={loading}
                  sx={{
                    textTransform: "none",
                    borderColor: '#28a745',
                    color: '#28a745',
                    '&:hover': { borderColor: '#28a745', bgcolor: '#28a745', color: 'white' }
                  }}
                >
                  Số điện thoại
                </Button>
              </Grid>
            </Grid>

            {/* Login Link */}
            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {getText("auth.alreadyHaveAccount")}{" "}
                <Link
                  component="button"
                  type="button"
                  onClick={() => navigate("/login")}
                  color="primary"
                  sx={{ textDecoration: "none", fontWeight: "bold" }}
                >
                  {getText("auth.loginHere")}
                </Link>
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Phone OTP Modal */}
      <PhoneOTPModal
        open={phoneModalOpen}
        onClose={() => setPhoneModalOpen(false)}
        onSuccess={handlePhoneOTPSuccess}
        mode="register"
      />
    </Box>
  );
};

export default RegisterPage;
