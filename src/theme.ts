"use client";
import { createTheme } from "@mui/material/styles";

// Extend MUI's palette interface to include tertiary color
declare module "@mui/material/styles" {
  interface Palette {
    tertiary: Palette["primary"];
  }

  interface PaletteOptions {
    tertiary?: PaletteOptions["primary"];
  }
}

//MUI's Button module augmentation
declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    tertiary: true;
  }
}

declare module "@mui/material/IconButton" {
  interface IconButtonPropsColorOverrides {
    tertiary: true;
  }
}
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
      "50": "#f1f7fe",
      "100": "#e3ecfb",
      "200": "#c0d9f7",
      "300": "#88bbf1",
      "400": "#4998e7",
      "500": "#227bd5",
      "600": "#1565c0",
      "700": "#114c93",
      "800": "#12427a",
      "900": "#153965",
      A100: "#0e2443",
      main: "#1565c0",
    },
    secondary: {
      "50": "#f2f4ff",
      "100": "#e7eaff",
      "200": "#d3d9ff",
      "300": "#afb8ff",
      "400": "#828aff",
      "500": "#4f51ff",
      "600": "#342bfc",
      "700": "#2719e8",
      "800": "#2015c2",
      "900": "#1b1297",
      A100: "#0c096c",
      main: "#1b1297",
    },
    tertiary: {
      "50": "#f1fcfa",
      "100": "#d0f7f1",
      "200": "#a1eee4",
      "300": "#6aded3",
      "400": "#3cc5bc",
      "500": "#23aca5",
      "600": "#198885",
      "700": "#186d6b",
      "800": "#185757",
      "900": "#184948",
      A100: "#082a2b",
      main: "#23aca5", // Tertiary
    },
  },
});

export default theme;
