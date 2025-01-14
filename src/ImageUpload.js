import React, { useState } from "react";
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

const ImageUpload = () => {
  const [files, setFiles] = useState([]);
  const [originalImages, setOriginalImages] = useState([]); // Store original images
  const [segmentationInfo, setSegmentationInfo] = useState([]);
  const [segmentedImages, setSegmentedImages] = useState([]);
  const [ph, setPh] = useState(2); // Default pixel height in microns
  const [pw, setPw] = useState(2); // Default pixel width in microns
  const [sw, setSw] = useState(20); // Default slice width in microns
  const [totalFluidArea, setTotalFluidArea] = useState(null); // Store total fluid area
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files); // Convert FileList to Array
    setFiles(selectedFiles);

    // Convert files to base64 strings to display the original images
    const imagePreviews = selectedFiles.map((file) => URL.createObjectURL(file));
    setOriginalImages(imagePreviews);

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
          Subretinal Fluid Segmentation App
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ textAlign: "center", fontStyle: "italic", mb: 2 }}
        >
          Disclaimer: This is a placeholder text for any important information you would like users to know about the segmentation process or its limitations.
        </Typography>

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
                  Subretinal Fluid Volume:{" "}
                  <strong>
                    {info.subretinal_fluid_area.toFixed(2)} µm³
                  </strong>
                </Typography>
                <Box display="flex" justifyContent="space-between" gap={2}>
                  {/* Original image */}
                  <img
                    src={originalImages[index]}
                    alt={`Original Input ${info.filename}`}
                    style={{
                      width: "48%",
                      maxHeight: "300px",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                    }}
                  />
                  {/* Segmented image */}
                  <img
                    src={segmentedImages[index]}
                    alt={`Segmented Output ${info.filename}`}
                    style={{
                      width: "48%",
                      maxHeight: "300px",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                    }}
                  />
                </Box>
                <Typography
                  variant="h6"
                  sx={{ cursor: "pointer", color: "blue", textDecoration: "underline", mt: 2 }}
                  onClick={() =>
                    downloadImage(
                      segmentedImages[index],
                      `segmented_image_${info.filename}`
                    )
                  }
                >
                  Segmented Image for File {info.filename} (Click to Download)
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default ImageUpload;
