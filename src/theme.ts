"use client";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  cssVariables: true,
  typography: {
    fontFamily: "var(--font-roboto)",
  },
  colorSchemes: {
    light: true,
    dark: true,
  },
  palette: {
    mode: "light",
    primary: {
      50: "#f1f7fe",
      100: "#e3ecfb",
      200: "#c0d9f7",
      300: "#88bbf1",
      400: "#4998e7",
      500: "#227bd5",
      600: "#1565c0",
      700: "#114c93",
      800: "#12427a",
      900: "#153965",
      A100: "#0e2443",
      main: "#1565c0",
    },
    secondary: {
      50: "#fdf6f2",
      100: "#fae5da",
      200: "#f6c9ae",
      300: "#eda57a",
      400: "#e0834d",
      500: "#c97535",
      600: "#b05f2b",
      700: "#8a4821",
      800: "#6b3b1c",
      900: "#573218",
      A100: "#311a0e",
      main: "#c97535",
    },
  },
});

export default theme;
