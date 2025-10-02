import React, { useState, useEffect } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    TextField,
    Alert,
    CircularProgress,
    Avatar,
    Stack,
    Divider,
} from "@mui/material";
import {
    MarkEmailRead,
    Refresh,
    CheckCircle,
    Error as ErrorIcon,
} from "@mui/icons-material";
import { useNavigate, useSearchParams } from "react-router-dom";

const EmailVerification = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [status, setStatus] = useState("pending"); // pending, success, error, expired
    const [loading, setLoading] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);
    const [verificationCode, setVerificationCode] = useState("");

    const email = searchParams.get("email") || "";
    const token = searchParams.get("token") || "";

    useEffect(() => {
        if (token) {
            verifyEmailToken(token);
        }
    }, [token]);

    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    const verifyEmailToken = async (verificationToken) => {
        setLoading(true);

        try {
            // Mock API call - in real app, verify token with backend
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Simulate different scenarios based on token
            if (verificationToken.includes("expired")) {
                setStatus("expired");
            } else if (verificationToken.includes("invalid")) {
                setStatus("error");
            } else {
                setStatus("success");
                // Auto redirect after successful verification
                setTimeout(() => {
                    navigate("/login?verified=true");
                }, 2000);
            }
        } catch (error) {
            setStatus("error");
        } finally {
            setLoading(false);
        }
    };

    const handleManualVerification = async () => {
        if (!verificationCode.trim()) return;

        setLoading(true);

        try {
            // Mock verification - in real app, send code to backend
            await new Promise(resolve => setTimeout(resolve, 1000));

            if (verificationCode === "123456") {
                setStatus("success");
                setTimeout(() => navigate("/login?verified=true"), 2000);
            } else {
                throw new Error("Invalid code");
            }
        } catch (error) {
            setStatus("error");
        } finally {
            setLoading(false);
        }
    };

    const handleResendEmail = async () => {
        if (resendCooldown > 0) return;

        setLoading(true);

        try {
            // Mock resend API
            await new Promise(resolve => setTimeout(resolve, 800));
            setResendCooldown(60); // 60 second cooldown
            setStatus("pending");
        } catch (error) {
            console.error("Resend failed:", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusContent = () => {
        switch (status) {
            case "success":
                return {
                    icon: <CheckCircle sx={{ fontSize: 64, color: "success.main" }} />,
                    title: "Xác thực thành công! ✅",
                    message: "Email của bạn đã được xác thực. Bạn sẽ được chuyển hướng đến trang đăng nhập.",
                    color: "success"
                };
            case "error":
                return {
                    icon: <ErrorIcon sx={{ fontSize: 64, color: "error.main" }} />,
                    title: "Xác thực thất bại ❌",
                    message: "Mã xác thực không chính xác hoặc đã hết hạn. Vui lòng thử lại.",
                    color: "error"
                };
            case "expired":
                return {
                    icon: <ErrorIcon sx={{ fontSize: 64, color: "warning.main" }} />,
                    title: "Link đã hết hạn ⏰",
                    message: "Link xác thực đã hết hạn. Vui lòng gửi lại email xác thực.",
                    color: "warning"
                };
            default:
                return {
                    icon: <MarkEmailRead sx={{ fontSize: 64, color: "primary.main" }} />,
                    title: "Xác thực email 📧",
                    message: `Chúng tôi đã gửi mã xác thực đến email: ${email}`,
                    color: "primary"
                };
        }
    };

    const statusContent = getStatusContent();

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                p: 2,
            }}
        >
            <Card sx={{ maxWidth: 480, width: "100%", borderRadius: 3 }}>
                <CardContent sx={{ p: 4 }}>
                    {/* Header */}
                    <Box sx={{ textAlign: "center", mb: 4 }}>
                        <Avatar
                            sx={{
                                width: 80,
                                height: 80,
                                mx: "auto",
                                mb: 2,
                                background: "linear-gradient(135deg, #B5FF3D 0%, #1379FF 100%)",
                            }}
                        >
                            <Typography variant="h4" fontWeight="bold" color="white">
                                S
                            </Typography>
                        </Avatar>
                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                            SkaEV
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Hệ thống sạc xe điện thông minh
                        </Typography>
                    </Box>

                    {/* Status Display */}
                    <Box sx={{ textAlign: "center", mb: 4 }}>
                        {statusContent.icon}
                        <Typography variant="h6" fontWeight="bold" sx={{ mt: 2, mb: 1 }}>
                            {statusContent.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {statusContent.message}
                        </Typography>
                    </Box>

                    {/* Loading State */}
                    {loading && (
                        <Box sx={{ textAlign: "center", mb: 3 }}>
                            <CircularProgress size={32} />
                            <Typography variant="body2" sx={{ mt: 1 }}>
                                Đang xử lý...
                            </Typography>
                        </Box>
                    )}

                    {/* Manual Verification (if no auto token) */}
                    {!token && status === "pending" && !loading && (
                        <Box sx={{ mb: 3 }}>
                            <TextField
                                fullWidth
                                label="Mã xác thực 6 số"
                                placeholder="Nhập mã từ email"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                inputProps={{ maxLength: 6, style: { textAlign: "center", fontSize: "1.2rem" } }}
                                sx={{ mb: 2 }}
                            />
                            <Button
                                fullWidth
                                variant="contained"
                                onClick={handleManualVerification}
                                disabled={verificationCode.length !== 6}
                                sx={{
                                    background: "linear-gradient(135deg, #B5FF3D 0%, #1379FF 100%)",
                                    fontWeight: "bold",
                                    py: 1.5,
                                }}
                            >
                                Xác thực
                            </Button>
                        </Box>
                    )}

                    {/* Action Buttons */}
                    <Stack spacing={2}>
                        {(status === "pending" || status === "expired") && (
                            <Button
                                variant="outlined"
                                startIcon={<Refresh />}
                                onClick={handleResendEmail}
                                disabled={loading || resendCooldown > 0}
                                fullWidth
                            >
                                {resendCooldown > 0
                                    ? `Gửi lại sau ${resendCooldown}s`
                                    : "Gửi lại email xác thực"
                                }
                            </Button>
                        )}

                        {status === "error" && (
                            <Button
                                variant="outlined"
                                onClick={() => setStatus("pending")}
                                fullWidth
                            >
                                Thử lại
                            </Button>
                        )}

                        <Divider sx={{ my: 2 }} />

                        <Button
                            variant="text"
                            onClick={() => navigate("/login")}
                            fullWidth
                        >
                            ← Quay lại đăng nhập
                        </Button>

                        <Button
                            variant="text"
                            onClick={() => navigate("/register")}
                            fullWidth
                        >
                            Đăng ký tài khoản khác
                        </Button>
                    </Stack>

                    {/* Help Text */}
                    <Alert severity="info" sx={{ mt: 3 }}>
                        <Typography variant="caption">
                            💡 <strong>Mẹo:</strong> Kiểm tra thư mục spam nếu không nhận được email.
                            Mã xác thực có hiệu lực trong 15 phút.
                        </Typography>
                    </Alert>
                </CardContent>
            </Card>
        </Box>
    );
};

export default EmailVerification;