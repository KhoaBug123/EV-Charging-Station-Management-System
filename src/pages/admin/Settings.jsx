import React, { useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Divider,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tab,
  Tabs,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Settings,
  Security,
  Notifications,
  Language,
  Palette,
  Storage,
  CloudSync,
  Edit,
  Delete,
  Add,
  Save,
  Restore,
} from "@mui/icons-material";

const AdminSettings = () => {
  const [tabValue, setTabValue] = useState(0);
  const [settings, setSettings] = useState({
    // System Settings
    maintenanceMode: false,
    autoBackup: true,
    systemNotifications: true,
    debugMode: false,

    // Security Settings
    twoFactorAuth: true,
    passwordExpiry: 90,
    sessionTimeout: 30,
    loginAttempts: 5,

    // Notification Settings
    emailNotifications: true,
    smsAlerts: false,
    pushNotifications: true,
    alertThreshold: 85,

    // Business Settings
    currency: "VND",
    timezone: "Asia/Ho_Chi_Minh",
    language: "vi",
    dateFormat: "DD/MM/YYYY",
  });

  const [apiKeys] = useState([
    {
      id: 1,
      name: "Payment Gateway API",
      key: "pk_live_***************",
      status: "active",
      lastUsed: "2024-03-15",
    },
    {
      id: 2,
      name: "SMS Service API",
      key: "sk_test_***************",
      status: "active",
      lastUsed: "2024-03-14",
    },
    {
      id: 3,
      name: "Maps Integration",
      key: "AIza***************",
      status: "inactive",
      lastUsed: "2024-03-10",
    },
  ]);

  const [backupHistory] = useState([
    {
      id: 1,
      type: "Full Backup",
      date: "2024-03-15 02:00:00",
      size: "2.3 GB",
      status: "success",
    },
    {
      id: 2,
      type: "Incremental Backup",
      date: "2024-03-14 02:00:00",
      size: "450 MB",
      status: "success",
    },
    {
      id: 3,
      type: "Full Backup",
      date: "2024-03-13 02:00:00",
      size: "2.1 GB",
      status: "failed",
    },
  ]);

  const [editDialog, setEditDialog] = useState(false);
  const [selectedApiKey, setSelectedApiKey] = useState(null);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSettingChange = (setting, value) => {
    setSettings({ ...settings, [setting]: value });
  };

  const handleSaveSettings = () => {
    // Here you would save settings to backend
    console.log("Saving settings:", settings);
    // Show success message
  };

  const handleEditApiKey = (apiKey) => {
    setSelectedApiKey(apiKey);
    setEditDialog(true);
  };

  const handleCreateBackup = () => {
    console.log("Creating backup...");
    // Implement backup creation
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
      case "success":
        return "success";
      case "inactive":
      case "failed":
        return "error";
      case "warning":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          System Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Configure system preferences and manage application settings
        </Typography>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="General" />
          <Tab label="Security" />
          <Tab label="Notifications" />
          <Tab label="API Keys" />
          <Tab label="Backup" />
        </Tabs>
      </Box>

      {/* General Settings */}
      {tabValue === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  System Configuration
                </Typography>

                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.maintenanceMode}
                      onChange={(e) =>
                        handleSettingChange("maintenanceMode", e.target.checked)
                      }
                    />
                  }
                  label="Maintenance Mode"
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ ml: 4, mb: 2 }}
                >
                  Enable maintenance mode to prevent user access during updates
                </Typography>

                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.autoBackup}
                      onChange={(e) =>
                        handleSettingChange("autoBackup", e.target.checked)
                      }
                    />
                  }
                  label="Automatic Backup"
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ ml: 4, mb: 2 }}
                >
                  Automatically backup system data daily at 2:00 AM
                </Typography>

                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.systemNotifications}
                      onChange={(e) =>
                        handleSettingChange(
                          "systemNotifications",
                          e.target.checked
                        )
                      }
                    />
                  }
                  label="System Notifications"
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ ml: 4, mb: 2 }}
                >
                  Enable system-wide notifications for administrators
                </Typography>

                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.debugMode}
                      onChange={(e) =>
                        handleSettingChange("debugMode", e.target.checked)
                      }
                    />
                  }
                  label="Debug Mode"
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ ml: 4 }}
                >
                  Enable detailed logging for troubleshooting
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Regional Settings
                </Typography>

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Currency</InputLabel>
                  <Select
                    value={settings.currency}
                    label="Currency"
                    onChange={(e) =>
                      handleSettingChange("currency", e.target.value)
                    }
                  >
                    <MenuItem value="VND">Vietnamese Dong (VND)</MenuItem>
                    <MenuItem value="USD">US Dollar (USD)</MenuItem>
                    <MenuItem value="EUR">Euro (EUR)</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Timezone</InputLabel>
                  <Select
                    value={settings.timezone}
                    label="Timezone"
                    onChange={(e) =>
                      handleSettingChange("timezone", e.target.value)
                    }
                  >
                    <MenuItem value="Asia/Ho_Chi_Minh">
                      Vietnam (UTC+7)
                    </MenuItem>
                    <MenuItem value="UTC">UTC (UTC+0)</MenuItem>
                    <MenuItem value="America/New_York">
                      New York (UTC-5)
                    </MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Language</InputLabel>
                  <Select
                    value={settings.language}
                    label="Language"
                    onChange={(e) =>
                      handleSettingChange("language", e.target.value)
                    }
                  >
                    <MenuItem value="vi">Tiếng Việt</MenuItem>
                    <MenuItem value="en">Tiếng Anh</MenuItem>
                    <MenuItem value="zh">中文</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Date Format</InputLabel>
                  <Select
                    value={settings.dateFormat}
                    label="Date Format"
                    onChange={(e) =>
                      handleSettingChange("dateFormat", e.target.value)
                    }
                  >
                    <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
                    <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
                    <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
                  </Select>
                </FormControl>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
              <Button variant="outlined" startIcon={<Restore />}>
                Reset to Default
              </Button>
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={handleSaveSettings}
              >
                Save Settings
              </Button>
            </Box>
          </Grid>
        </Grid>
      )}

      {/* Security Settings */}
      {tabValue === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Authentication Settings
                </Typography>

                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.twoFactorAuth}
                      onChange={(e) =>
                        handleSettingChange("twoFactorAuth", e.target.checked)
                      }
                    />
                  }
                  label="Two-Factor Authentication"
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ ml: 4, mb: 3 }}
                >
                  Require 2FA for admin accounts
                </Typography>

                <TextField
                  fullWidth
                  label="Password Expiry (days)"
                  type="number"
                  value={settings.passwordExpiry}
                  onChange={(e) =>
                    handleSettingChange(
                      "passwordExpiry",
                      parseInt(e.target.value)
                    )
                  }
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="Session Timeout (minutes)"
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) =>
                    handleSettingChange(
                      "sessionTimeout",
                      parseInt(e.target.value)
                    )
                  }
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="Max Login Attempts"
                  type="number"
                  value={settings.loginAttempts}
                  onChange={(e) =>
                    handleSettingChange(
                      "loginAttempts",
                      parseInt(e.target.value)
                    )
                  }
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Security Status
                </Typography>

                <Alert severity="success" sx={{ mb: 2 }}>
                  SSL Certificate valid until Dec 31, 2024
                </Alert>

                <Alert severity="info" sx={{ mb: 2 }}>
                  Last security scan: March 15, 2024
                </Alert>

                <Alert severity="warning">
                  3 failed login attempts in the last 24 hours
                </Alert>

                <Button variant="outlined" fullWidth sx={{ mt: 2 }}>
                  Run Security Scan
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Notification Settings */}
      {tabValue === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Notification Channels
                </Typography>

                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.emailNotifications}
                      onChange={(e) =>
                        handleSettingChange(
                          "emailNotifications",
                          e.target.checked
                        )
                      }
                    />
                  }
                  label="Email Notifications"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.smsAlerts}
                      onChange={(e) =>
                        handleSettingChange("smsAlerts", e.target.checked)
                      }
                    />
                  }
                  label="SMS Alerts"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.pushNotifications}
                      onChange={(e) =>
                        handleSettingChange(
                          "pushNotifications",
                          e.target.checked
                        )
                      }
                    />
                  }
                  label="Push Notifications"
                />

                <TextField
                  fullWidth
                  label="Alert Threshold (%)"
                  type="number"
                  value={settings.alertThreshold}
                  onChange={(e) =>
                    handleSettingChange(
                      "alertThreshold",
                      parseInt(e.target.value)
                    )
                  }
                  sx={{ mt: 2 }}
                  helperText="Send alert when system usage exceeds this percentage"
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* API Keys */}
      {tabValue === 3 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                  }}
                >
                  <Typography variant="h6" fontWeight="bold">
                    API Keys Management
                  </Typography>
                  <Button startIcon={<Add />} variant="contained">
                    Add API Key
                  </Button>
                </Box>

                <List>
                  {apiKeys.map((apiKey) => (
                    <ListItem key={apiKey.id} divider>
                      <ListItemText
                        primary={apiKey.name}
                        secondary={
                          <Box>
                            <Typography variant="body2" component="span">
                              Key: {apiKey.key}
                            </Typography>
                            <br />
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Last used: {apiKey.lastUsed}
                            </Typography>
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <Chip
                          label={apiKey.status}
                          color={getStatusColor(apiKey.status)}
                          size="small"
                          sx={{ mr: 1 }}
                        />
                        <IconButton
                          size="small"
                          onClick={() => handleEditApiKey(apiKey)}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton size="small" color="error">
                          <Delete />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Backup Settings */}
      {tabValue === 4 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Backup Configuration
                </Typography>

                <Button
                  variant="contained"
                  startIcon={<CloudSync />}
                  onClick={handleCreateBackup}
                  sx={{ mb: 3 }}
                >
                  Create Backup Now
                </Button>

                <Alert severity="info" sx={{ mb: 2 }}>
                  Next automatic backup: March 16, 2024 at 2:00 AM
                </Alert>

                <Typography variant="subtitle2" gutterBottom>
                  Backup Settings
                </Typography>
                <FormControlLabel
                  control={<Switch checked={settings.autoBackup} />}
                  label="Enable Automatic Backup"
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Backup History
                </Typography>

                <List>
                  {backupHistory.slice(0, 5).map((backup) => (
                    <ListItem key={backup.id} divider>
                      <ListItemText
                        primary={backup.type}
                        secondary={
                          <Box>
                            <Typography variant="body2" component="span">
                              {backup.date} • {backup.size}
                            </Typography>
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <Chip
                          label={backup.status}
                          color={getStatusColor(backup.status)}
                          size="small"
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Edit API Key Dialog */}
      <Dialog
        open={editDialog}
        onClose={() => setEditDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit API Key</DialogTitle>
        <DialogContent>
          {selectedApiKey && (
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="API Key Name"
                defaultValue={selectedApiKey.name}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="API Key"
                defaultValue={selectedApiKey.key}
                sx={{ mb: 2 }}
              />
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select defaultValue={selectedApiKey.status} label="Status">
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog(false)}>Cancel</Button>
          <Button variant="contained">Save Changes</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminSettings;
