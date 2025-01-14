import React from "react";
import { Box, Typography, TextField, Paper, Link } from "@mui/material";

const CitePage = () => {
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
          Cite Our Work
        </Typography>

        {/* Research Article Section */}
        <Box my={4}>
          <Typography variant="h6" gutterBottom>
            Research Article
          </Typography>
          <TextField
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            placeholder="Enter the citation for the research article here..."
            sx={{ mb: 2 }}
          />
          <Typography variant="body2" color="textSecondary">
            Example: Author(s). Title. Journal Name. Year; Volume(Issue):Pages. DOI/URL
          </Typography>
        </Box>

        {/* GitHub Repository Section */}
        <Box my={4}>
          <Typography variant="h6" gutterBottom>
            GitHub Repository
          </Typography>
          <Link
            href="https://github.com/your-repo-url"
            target="_blank"
            rel="noopener"
            sx={{ fontSize: "1rem" }}
          >
            https://github.com/your-repo-url
          </Link>
        </Box>
      </Paper>
    </Box>
  );
};

export default CitePage;
