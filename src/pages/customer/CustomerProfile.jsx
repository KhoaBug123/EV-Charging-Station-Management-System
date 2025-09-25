import React, { useState } from "react";
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
  Divider,
  Switch,
  FormControlLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Alert,
  Chip,
} from "@mui/material";
import {
  Person,
  Email,
  Phone,
  LocationOn,
  Edit,
  Security,
  Notifications,
  Language,
  Save,
  Verified,
} from "@mui/icons-material";
import useAuthStore from "../../store/authStore";

const CustomerProfile = () => {
  const { user, updateUser } = useAuthStore();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    city: user?.city || "",
    province: user?.province || "",
    language: "vi",
    notifications: {
      email: true,
      sms: false,
      push: true,
      marketing: false,
    },
  });

  const handleSave = () => {
    updateUser(formData);
    setEditMode(false);
  };

  const handleNotificationChange = (type) => {
    setFormData({
      ...formData,
      notifications: {
        ...formData.notifications,
        [type]: !formData.notifications[type],
      },
    });
  };

  const profileStats = [
    { label: "Member Since", value: "Jan 2024", icon: <Person /> },
    { label: "Total Sessions", value: "24", icon: <Verified /> },
    {
      label: "Favorite Station",
      value: "SkaEV Downtown",
      icon: <LocationOn />,
    },
    { label: "Account Status", value: "Verified", icon: <Security /> },
  ];

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar
            sx={{
              bgcolor: "primary.main",
              width: 64,
              height: 64,
              mr: 3,
              fontSize: "1.5rem",
            }}
          >
            {user?.name?.charAt(0) || "U"}
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight="bold">
              {user?.name || "User Profile"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage your account settings and preferences
            </Typography>
          </Box>
        </Box>
        <Button
          variant={editMode ? "outlined" : "contained"}
          startIcon={editMode ? <Save /> : <Edit />}
          onClick={editMode ? handleSave : () => setEditMode(true)}
        >
          {editMode ? "Save Changes" : "Edit Profile"}
        </Button>
      </Box>

      <Grid container spacing={4}>
        {/* Profile Information */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Personal Information
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    disabled={!editMode}
                    InputProps={{
                      startAdornment: (
                        <Person sx={{ mr: 1, color: "action.active" }} />
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    disabled={!editMode}
                    InputProps={{
                      startAdornment: (
                        <Email sx={{ mr: 1, color: "action.active" }} />
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    disabled={!editMode}
                    InputProps={{
                      startAdornment: (
                        <Phone sx={{ mr: 1, color: "action.active" }} />
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth disabled={!editMode}>
                    <InputLabel>Language</InputLabel>
                    <Select
                      value={formData.language}
                      label="Language"
                      onChange={(e) =>
                        setFormData({ ...formData, language: e.target.value })
                      }
                      startAdornment={
                        <Language sx={{ mr: 1, color: "action.active" }} />
                      }
                    >
                      <MenuItem value="vi">Tiếng Việt</MenuItem>
                      <MenuItem value="en">English</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    disabled={!editMode}
                    multiline
                    rows={2}
                    InputProps={{
                      startAdornment: (
                        <LocationOn
                          sx={{
                            mr: 1,
                            color: "action.active",
                            alignSelf: "flex-start",
                            mt: 1,
                          }}
                        />
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="City"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    disabled={!editMode}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Province"
                    value={formData.province}
                    onChange={(e) =>
                      setFormData({ ...formData, province: e.target.value })
                    }
                    disabled={!editMode}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Notification Preferences
              </Typography>

              <List>
                <ListItem>
                  <ListItemIcon>
                    <Email />
                  </ListItemIcon>
                  <ListItemText
                    primary="Email Notifications"
                    secondary="Receive booking confirmations and updates via email"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={formData.notifications.email}
                      onChange={() => handleNotificationChange("email")}
                      disabled={!editMode}
                    />
                  </ListItemSecondaryAction>
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <Phone />
                  </ListItemIcon>
                  <ListItemText
                    primary="SMS Notifications"
                    secondary="Get text messages for important updates"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={formData.notifications.sms}
                      onChange={() => handleNotificationChange("sms")}
                      disabled={!editMode}
                    />
                  </ListItemSecondaryAction>
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <Notifications />
                  </ListItemIcon>
                  <ListItemText
                    primary="Push Notifications"
                    secondary="Receive browser notifications for real-time updates"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={formData.notifications.push}
                      onChange={() => handleNotificationChange("push")}
                      disabled={!editMode}
                    />
                  </ListItemSecondaryAction>
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <Notifications />
                  </ListItemIcon>
                  <ListItemText
                    primary="Marketing Communications"
                    secondary="Receive promotional offers and news"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={formData.notifications.marketing}
                      onChange={() => handleNotificationChange("marketing")}
                      disabled={!editMode}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Profile Stats */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Account Overview
              </Typography>

              {profileStats.map((stat, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Avatar
                      sx={{
                        bgcolor: "primary.light",
                        width: 32,
                        height: 32,
                        mr: 2,
                      }}
                    >
                      {stat.icon}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {stat.label}
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {stat.value}
                      </Typography>
                    </Box>
                  </Box>
                  {index < profileStats.length - 1 && <Divider />}
                </Box>
              ))}
            </CardContent>
          </Card>

          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Account Security
              </Typography>

              <Alert severity="success" sx={{ mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Verified />
                  <Typography variant="body2">
                    Your account is verified and secure
                  </Typography>
                </Box>
              </Alert>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Password
                </Typography>
                <Typography variant="body2">
                  Last changed 30 days ago
                </Typography>
                <Button size="small" sx={{ mt: 1 }}>
                  Change Password
                </Button>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Two-Factor Authentication
                </Typography>
                <Chip
                  label="Enabled"
                  color="success"
                  size="small"
                  icon={<Security />}
                />
                <Button size="small" sx={{ ml: 1 }}>
                  Manage
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CustomerProfile;
