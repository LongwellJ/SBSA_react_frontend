import { createTheme, ThemeProvider } from "@mui/material/styles";
import ImageUpload from "./ImageUpload";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
  },
});

const App = () => (
  <ThemeProvider theme={theme}>
    <ImageUpload />
  </ThemeProvider>
);

export default App;