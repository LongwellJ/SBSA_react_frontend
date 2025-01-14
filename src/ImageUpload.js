import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  Typography,
  Paper,
  Input,
  CircularProgress,
  Alert,
  TextField,
} from "@mui/material";
import { CloudUpload as CloudUploadIcon } from "@mui/icons-material";

// Main Page Component
const ImageUpload = () => {
  const [files, setFiles] = useState([]);
  const [segmentationInfo, setSegmentationInfo] = useState([]);
  const [segmentedImages, setSegmentedImages] = useState([]);
  const [ph, setPh] = useState(2); // Default pixel height in microns
  const [pw, setPw] = useState(2); // Default pixel width in microns
  const [sw, setSw] = useState(20); // Default slice width in microns
  const [totalFluidArea, setTotalFluidArea] = useState(null); // Store total fluid area
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    setFiles(Array.from(event.target.files)); // Convert FileList to Array
    setError("");
    setSegmentationInfo([]);
    setSegmentedImages([]);
    setTotalFluidArea(null); // Reset total fluid area
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setError("Please select at least one file to upload.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file)); // Append all files

      // Append the ph, pw, and sw values as query parameters
      const response = await axios.post(
        `https://afternoon-shore-89126-fe1f05736c55.herokuapp.com/predict/?ph=${ph}&pw=${pw}&sw=${sw}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Update segmentationInfo and segmentedImages for all files
      const results = response.data.results;
      setSegmentationInfo(results);
      setSegmentedImages(results.map((res) => `data:image/png;base64,${res.segmented_image}`));
      setTotalFluidArea(response.data.total_fluid_area); // Store total fluid area
      setError("");
    } catch (err) {
      setError("Failed to process the images. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Helper to download a single image
  const downloadImage = (base64Image, filename) => {
    const link = document.createElement("a");
    link.href = base64Image;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper to download all images
  const downloadAllImages = () => {
    segmentedImages.forEach((base64Image, index) => {
      const filename = `segmented_image_${index + 1}.png`;
      downloadImage(base64Image, filename);
    });
  };

  return (
    <Box>
      {/* Navigation Bar */}
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ p: 2, bgcolor: "#f5f5f5", borderBottom: "1px solid #ddd" }}>
        <Typography variant="h5">Subretinal Fluid Segmentation App</Typography>
        <Button component={Link} to="/about" variant="text" sx={{ fontWeight: "bold" }}>
          About
        </Button>
      </Box>

      {/* Main Content */}
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: "calc(100vh - 64px)", bgcolor: "#f4f4f4", p: 3 }}
      >
        <Paper
          elevation={3}
          sx={{ p: 4, width: "100%", maxWidth: "600px", textAlign: "center" }}
        >
          {/* Form for pixel height, width, and slice width */}
          <Box my={2} display="flex" gap={2} justifyContent="center">
            <TextField
              label="Pixel Height (microns)"
              type="number"
              value={ph}
              onChange={(e) => setPh(parseFloat(e.target.value))}
              variant="outlined"
              size="small"
            />
            <TextField
              label="Pixel Width (microns)"
              type="number"
              value={pw}
              onChange={(e) => setPw(parseFloat(e.target.value))}
              variant="outlined"
              size="small"
            />
            <TextField
              label="Slice Width (microns)"
              type="number"
              value={sw}
              onChange={(e) => setSw(parseFloat(e.target.value))}
              variant="outlined"
              size="small"
            />
          </Box>

          <Box my={2}>
            <Input
              type="file"
              onChange={handleFileChange}
              disableUnderline
              inputProps={{ accept: "image/*", multiple: true }}
            />
          </Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<CloudUploadIcon />}
            onClick={handleUpload}
            disabled={loading}
          >
            {loading ? "Processing..." : "Upload and Analyze"}
          </Button>
          {loading && (
            <Box mt={2}>
              <CircularProgress />
            </Box>
          )}
          {error && (
            <Box mt={2}>
              <Alert severity="error">{error}</Alert>
            </Box>
          )}
          {segmentationInfo.length > 0 && (
            <Box mt={4}>
              {/* Add "Download All" Button */}
              <Button
                variant="contained"
                color="secondary"
                onClick={downloadAllImages}
                sx={{ mb: 2 }}
              >
                Download All Segmented Images
              </Button>
              {/* Disclaimer about browser settings */}
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{ textAlign: "center", fontStyle: "italic" }}
              >
                Note: You may need to adjust your browser settings to allow multiple file downloads at once.
              </Typography>
              {/* Display total subretinal fluid area below the disclaimer */}
              {totalFluidArea !== null && (
                <Typography
                  variant="h6"
                  sx={{ my: 2, textAlign: "center", fontWeight: "bold" }}
                >
                  Total Subretinal Fluid Volume: {totalFluidArea.toFixed(2)} µm³
                </Typography>
              )}
              {segmentationInfo.map((info, index) => (
                <Box key={index} mb={4}>
                  <Typography variant="h6">
                    Segmentation Info for File {info.filename}:
                  </Typography>
                  <Box
                    component="pre"
                    sx={{
                      p: 2,
                      bgcolor: "#eaeaea",
                      borderRadius: 1,
                      textAlign: "left",
                    }}
                  >
                    {JSON.stringify(info.segmentation_info, null, 2)}
                  </Box>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Subretinal Fluid Area:{" "}
                    <strong>
                      {info.subretinal_fluid_area.toFixed(2)} µm³
                    </strong>
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
                    onClick={() =>
                      downloadImage(
                        segmentedImages[index],
                        `segmented_image_${info.filename}`
                      )
                    }
                  >
                    Segmented Image for File {info.filename} (Click to Download)
                  </Typography>
                  <img
                    src={segmentedImages[index]}
                    alt={`Segmented Output ${info.filename}`}
                    style={{ width: "100%", maxHeight: "300px", borderRadius: "8px" }}
                  />
                </Box>
              ))}
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

// About Page Component
const AboutPage = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{ minHeight: "100vh", bgcolor: "#f4f4f4", p: 3 }}
    >
      <Paper
        elevation={3}
        sx={{ p: 4, width: "100%", maxWidth: "600px", textAlign: "center" }}
      >
        <Typography variant="h4" gutterBottom>
          About
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          This application is designed for analyzing subretinal fluid in medical images. 
          It provides insights into subretinal fluid segmentation using deep learning models.
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          <strong>Legal Disclaimer:</strong> Placeholder text for legal disclaimers.
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          <strong>Research Citation:</strong> Placeholder text for citing research papers.
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          <strong>GitHub Repository:</strong> Visit our repository at{" "}
          <a
            href="https://github.com/your-repo-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>{" "}
          for more details, including licensing information.
        </Typography>
        <Button component={Link} to="/" variant="contained" color="primary">
          Back to Home
        </Button>
      </Paper>
    </Box>
  );
};

// Main App Component
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ImageUpload />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </Router>
  );
};

export default App;
