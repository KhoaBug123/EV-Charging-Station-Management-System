import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import skaevTheme from "./theme";
import SimpleTest from "./pages/SimpleTest";

function App() {
  return (
    <ThemeProvider theme={skaevTheme}>
      <CssBaseline />
      <SimpleTest />
    </ThemeProvider>
  );
}

export default App;
