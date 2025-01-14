import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles"; // Import createTheme and ThemeProvider
import Navbar from "./Navbar"; // Import the Navbar component
import ImageUpload from "./ImageUpload"; // Main app component
import CitePage from "./CitePage"; // Cite page component

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}> {/* Wrap the app with ThemeProvider */}
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<ImageUpload />} />
          <Route path="/cite" element={<CitePage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
