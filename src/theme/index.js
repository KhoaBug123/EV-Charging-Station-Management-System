// SkaEV MUI Theme Configuration
import { createTheme } from "@mui/material/styles";

const skaevTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      50: "#E6F3FF",
      100: "#CCE7FF",
      200: "#99CFFF",
      300: "#66B7FF",
      400: "#339FFF",
      500: "#1379FF", // Main brand color
      600: "#0F61CC",
      700: "#0B4999",
      800: "#073166",
      900: "#031933",
      main: "#1379FF",
      contrastText: "#FFFFFF",
    },
    secondary: {
      50: "#F5FFED",
      100: "#EBFFDB",
      200: "#D7FFB7",
      300: "#C3FF93",
      400: "#AFFF6F",
      500: "#B5FF3D", // Lime Electric
      600: "#91CC31",
      700: "#6D9925",
      800: "#496619",
      900: "#25330D",
      main: "#B5FF3D",
      contrastText: "#12151A",
    },
    success: {
      main: "#10B981", // Available stations
      light: "#34D399",
      dark: "#047857",
    },
    warning: {
      main: "#F59E0B", // Limited availability
      light: "#FBBF24",
      dark: "#D97706",
    },
    error: {
      main: "#EF4444", // Offline/Error
      light: "#F87171",
      dark: "#DC2626",
    },
    info: {
      main: "#3B82F6",
      light: "#60A5FA",
      dark: "#2563EB",
    },
    grey: {
      50: "#F8F9FA",
      100: "#F1F3F5",
      200: "#E9ECEF",
      300: "#DEE2E6",
      400: "#CED4DA",
      500: "#ADB5BD",
      600: "#6C757D",
      700: "#495057",
      800: "#343A40",
      900: "#12151A",
    },
    text: {
      primary: "#12151A",
      secondary: "#495057",
      disabled: "#ADB5BD",
    },
    background: {
      default: "#FFFFFF",
      paper: "#F8F9FA",
    },
    // Custom charging status colors
    charging: "#B5FF3D",
    available: "#10B981",
    occupied: "#F59E0B",
    offline: "#EF4444",
  },

  typography: {
    fontFamily:
      '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 600,
    h1: {
      fontSize: "3rem", // 48px
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: "2.5rem", // 40px
      fontWeight: 600,
      lineHeight: 1.25,
    },
    h3: {
      fontSize: "2rem", // 32px
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: "1.5rem", // 24px
      fontWeight: 600,
      lineHeight: 1.35,
    },
    h5: {
      fontSize: "1.25rem", // 20px
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: "1.125rem", // 18px
      fontWeight: 500,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: "1rem", // 16px
      lineHeight: 1.5,
    },
    body2: {
      fontSize: "0.875rem", // 14px
      lineHeight: 1.5,
    },
    caption: {
      fontSize: "0.75rem", // 12px
      lineHeight: 1.4,
    },
  },

  spacing: 4, // 4px base unit

  shape: {
    borderRadius: 8,
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
          borderRadius: 8,
          padding: "12px 24px",
        },
        containedPrimary: {
          background: "linear-gradient(135deg, #1379FF 0%, #339FFF 100%)",
          boxShadow: "0 4px 12px rgba(19, 121, 255, 0.3)",
          "&:hover": {
            background: "linear-gradient(135deg, #0F61CC 0%, #1379FF 100%)",
            boxShadow: "0 6px 16px rgba(19, 121, 255, 0.4)",
          },
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(18, 21, 26, 0.08)",
          "&:hover": {
            boxShadow: "0 4px 16px rgba(18, 21, 26, 0.12)",
          },
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

export default skaevTheme;
