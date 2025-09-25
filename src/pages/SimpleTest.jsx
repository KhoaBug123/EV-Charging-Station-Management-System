import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { ElectricCar } from "@mui/icons-material";

const SimpleTest = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      p={3}
    >
      <ElectricCar sx={{ fontSize: 64, color: "primary.main", mb: 2 }} />
      <Typography variant="h3" fontWeight="bold" gutterBottom>
        SkaEV Test
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Testing basic functionality
      </Typography>
      <Button variant="contained" size="large">
        All Systems Working!
      </Button>
    </Box>
  );
};

export default SimpleTest;
