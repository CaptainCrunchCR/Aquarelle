import { themeQuartz, iconSetMaterial } from "ag-grid-community";

const themeQuartzCustom = themeQuartz.withPart(iconSetMaterial).withParams({
  browserColorScheme: "light",
  cellHorizontalPaddingScale: 1,
  headerFontSize: 14,
  rowVerticalPaddingScale: 1.5,
  cardShadow: "#00000018 0px 1px 10px 1px",
});

export default themeQuartzCustom;
