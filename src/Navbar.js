import React from "react";
import { Link } from "react-router-dom";
import { Box, Typography } from "@mui/material";

const Navbar = () => {
  return (
    <Box
      component="nav"
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        bgcolor: "#1976d2",
        color: "#fff",
        p: 2,
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
        My App
      </Typography>
      <Box>
        <Link to="/" style={{ color: "white", textDecoration: "none", marginRight: "16px" }}>
          Home
        </Link>
        <Link to="/cite" style={{ color: "white", textDecoration: "none" }}>
          Cite
        </Link>
      </Box>
    </Box>
  );
};

export default Navbar;
